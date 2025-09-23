-- 用户能力模型扩展 - MySQL数据库脚本
-- 执行时间：2025年1月

-- 1. 扩展UserAbilityProfile表，添加新的JSON字段
ALTER TABLE UserAbilityProfile 
ADD COLUMN `grammar_hall_data` JSON COMMENT '语法功能大厅数据：系统组合错题/语法分点偏好/专属组合配置',
ADD COLUMN `error_question_data` JSON COMMENT '错题特训数据：错题类型/错误原因/变式正确率',
ADD COLUMN `daily_practice_score` JSON COMMENT '日常练习实时分：语法各点正确率/书写模块正确率';

-- 2. 创建索引以优化JSON字段查询性能
CREATE INDEX idx_grammar_hall_data ON UserAbilityProfile ((CAST(grammar_hall_data->>'$.systemCombination.practiceCount' AS UNSIGNED)));
CREATE INDEX idx_error_question_data ON UserAbilityProfile ((CAST(error_question_data->>'$.improvementTrend' AS DECIMAL(5,2))));
CREATE INDEX idx_daily_practice_score ON UserAbilityProfile ((CAST(daily_practice_score->>'$.totalPracticeCount' AS UNSIGNED)));

-- 3. 创建触发器函数：同步语法功能大厅数据
DELIMITER $$

CREATE FUNCTION sync_grammar_hall_data(
    p_user_id VARCHAR(50),
    p_practice_module ENUM('systemCombination', 'grammarPoint', 'customCombination'),
    p_practice_data JSON
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result BOOLEAN DEFAULT FALSE;
    DECLARE v_existing_data JSON DEFAULT NULL;
    DECLARE v_updated_data JSON DEFAULT NULL;
    
    -- 获取现有数据
    SELECT grammar_hall_data INTO v_existing_data
    FROM UserAbilityProfile 
    WHERE user_id = p_user_id;
    
    -- 如果不存在记录，创建新记录
    IF v_exractice_data IS NULL THEN
        INSERT INTO UserAbilityProfile (user_id, grammar_hall_data)
        VALUES (p_user_id, JSON_OBJECT(
            'systemCombination', JSON_OBJECT('practiceCount', 0, 'accuracy', 0, 'lastUpdateTime', NOW()),
            'grammarPoint', JSON_OBJECT('practiceCount', 0, 'accuracy', 0, 'lastUpdateTime', NOW()),
            'customCombination', JSON_OBJECT('practiceCount', 0, 'accuracy', 0, 'lastUpdateTime', NOW())
        ));
        SELECT grammar_hall_data INTO v_existing_data
        FROM UserAbilityProfile 
        WHERE user_id = p_user_id;
    END IF;
    
    -- 更新指定模块的数据
    SET v_updated_data = JSON_SET(
        v_existing_data,
        CONCAT('$.', p_practice_module, '.practiceCount'),
        COALESCE(JSON_UNQUOTE(JSON_EXTRACT(v_existing_data, CONCAT('$.', p_practice_module, '.practiceCount'))), 0) + 1,
        CONCAT('$.', p_practice_module, '.accuracy'),
        COALESCE(JSON_UNQUOTE(JSON_EXTRACT(p_practice_data, '$.accuracy')), 0),
        CONCAT('$.', p_practice_module, '.lastUpdateTime'),
        NOW()
    );
    
    -- 根据模块类型更新特定数据
    CASE p_practice_module
        WHEN 'systemCombination' THEN
            IF JSON_EXTRACT(p_practice_data, '$.highFreqErrors') IS NOT NULL THEN
                SET v_updated_data = JSON_SET(
                    v_updated_data,
                    '$.systemCombination.highFreqErrors',
                    JSON_EXTRACT(p_practice_data, '$.highFreqErrors')
                );
            END IF;
        WHEN 'grammarPoint' THEN
            IF JSON_EXTRACT(p_practice_data, '$.repeatPoints') IS NOT NULL THEN
                SET v_updated_data = JSON_SET(
                    v_updated_data,
                    '$.grammarPoint.repeatPoints',
                    JSON_EXTRACT(p_practice_data, '$.repeatPoints')
                );
            END IF;
        WHEN 'customCombination' THEN
            IF JSON_EXTRACT(p_practice_data, '$.customPreferences') IS NOT NULL THEN
                SET v_updated_data = JSON_SET(
                    v_updated_data,
                    '$.customCombination.customPreferences',
                    JSON_EXTRACT(p_practice_data, '$.customPreferences')
                );
            END IF;
    END CASE;
    
    -- 更新数据库
    UPDATE UserAbilityProfile 
    SET grammar_hall_data = v_updated_data
    WHERE user_id = p_user_id;
    
    SET v_result = TRUE;
    RETURN v_result;
END$$

-- 4. 创建触发器函数：同步错题特训数据
CREATE FUNCTION sync_error_question_data(
    p_user_id VARCHAR(50),
    p_error_type VARCHAR(100),
    p_variant_accuracy DECIMAL(5,2),
    p_error_reason VARCHAR(200)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result BOOLEAN DEFAULT FALSE;
    DECLARE v_existing_data JSON DEFAULT NULL;
    DECLARE v_updated_data JSON DEFAULT NULL;
    DECLARE v_error_types JSON DEFAULT NULL;
    DECLARE v_variant_accuracy JSON DEFAULT NULL;
    DECLARE v_error_reasons JSON DEFAULT NULL;
    
    -- 获取现有数据
    SELECT error_question_data INTO v_existing_data
    FROM UserAbilityProfile 
    WHERE user_id = p_user_id;
    
    -- 如果不存在记录，创建新记录
    IF v_existing_data IS NULL THEN
        INSERT INTO UserAbilityProfile (user_id, error_question_data)
        VALUES (p_user_id, JSON_OBJECT(
            'errorTypes', JSON_ARRAY(),
            'variantAccuracy', JSON_ARRAY(),
            'errorReasons', JSON_OBJECT(),
            'improvementTrend', 0
        ));
        SELECT error_question_data INTO v_existing_data
        FROM UserAbilityProfile 
        WHERE user_id = p_user_id;
    END IF;
    
    -- 更新错题类型统计
    SET v_error_types = JSON_EXTRACT(v_existing_data, '$.errorTypes');
    -- 这里需要复杂的JSON操作来更新错题类型，简化处理
    
    -- 添加变式训练正确率记录
    SET v_variant_accuracy = JSON_EXTRACT(v_existing_data, '$.variantAccuracy');
    SET v_variant_accuracy = JSON_ARRAY_APPEND(
        v_variant_accuracy,
        '$',
        JSON_OBJECT(
            'errorType', p_error_type,
            'accuracy', p_variant_accuracy,
            'timestamp', NOW()
        )
    );
    
    -- 更新错误原因统计
    SET v_error_reasons = JSON_EXTRACT(v_existing_data, '$.errorReasons');
    IF p_error_reason IS NOT NULL THEN
        SET v_error_reasons = JSON_SET(
            v_error_reasons,
            CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_error_reason))),
            COALESCE(
                JSON_UNQUOTE(JSON_EXTRACT(v_error_reasons, CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_error_reason))))),
                0
            ) + 1
        );
    END IF;
    
    -- 构建更新后的数据
    SET v_updated_data = JSON_SET(
        v_existing_data,
        '$.variantAccuracy', v_variant_accuracy,
        '$.errorReasons', v_error_reasons
    );
    
    -- 更新数据库
    UPDATE UserAbilityProfile 
    SET error_question_data = v_updated_data
    WHERE user_id = p_user_id;
    
    SET v_result = TRUE;
    RETURN v_result;
END$$

-- 5. 创建触发器函数：更新日常练习实时分
CREATE FUNCTION update_daily_practice_score(
    p_user_id VARCHAR(50),
    p_practice_type ENUM('grammar', 'writing'),
    p_accuracy DECIMAL(5,2),
    p_grammar_point VARCHAR(100),
    p_writing_module VARCHAR(100)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result BOOLEAN DEFAULT FALSE;
    DECLARE v_existing_data JSON DEFAULT NULL;
    DECLARE v_updated_data JSON DEFAULT NULL;
    DECLARE v_grammar_points JSON DEFAULT NULL;
    DECLARE v_writing_modules JSON DEFAULT NULL;
    DECLARE v_recent_history JSON DEFAULT NULL;
    
    -- 获取现有数据
    SELECT daily_practice_score INTO v_existing_data
    FROM UserAbilityProfile 
    WHERE user_id = p_user_id;
    
    -- 如果不存在记录，创建新记录
    IF v_existing_data IS NULL THEN
        INSERT INTO UserAbilityProfile (user_id, daily_practice_score)
        VALUES (p_user_id, JSON_OBJECT(
            'grammarPointsAccuracy', JSON_OBJECT(),
            'writingModulesAccuracy', JSON_OBJECT(),
            'recentAccuracyHistory', JSON_ARRAY(),
            'lastUpdateTime', NOW(),
            'totalPracticeCount', 0
        ));
        SELECT daily_practice_score INTO v_existing_data
        FROM UserAbilityProfile 
        WHERE user_id = p_user_id;
    END IF;
    
    -- 更新总练习次数
    SET v_updated_data = JSON_SET(
        v_existing_data,
        '$.totalPracticeCount',
        COALESCE(JSON_UNQUOTE(JSON_EXTRACT(v_existing_data, '$.totalPracticeCount')), 0) + 1,
        '$.lastUpdateTime',
        NOW()
    );
    
    -- 根据练习类型更新相应数据
    IF p_practice_type = 'grammar' AND p_grammar_point IS NOT NULL THEN
        SET v_grammar_points = JSON_EXTRACT(v_existing_data, '$.grammarPointsAccuracy');
        SET v_grammar_points = JSON_SET(
            v_grammar_points,
            CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_grammar_point))),
            JSON_OBJECT(
                'totalCount', COALESCE(
                    JSON_UNQUOTE(JSON_EXTRACT(v_grammar_points, CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_grammar_point)), '.totalCount'))),
                    0
                ) + 1,
                'correctCount', COALESCE(
                    JSON_UNQUOTE(JSON_EXTRACT(v_grammar_points, CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_grammar_point)), '.correctCount'))),
                    0
                ) + IF(p_accuracy >= 80, 1, 0),
                'accuracy', 0, -- 将在后续计算
                'lastUpdateTime', NOW()
            )
        );
        SET v_updated_data = JSON_SET(v_updated_data, '$.grammarPointsAccuracy', v_grammar_points);
        
    ELSEIF p_practice_type = 'writing' AND p_writing_module IS NOT NULL THEN
        SET v_writing_modules = JSON_EXTRACT(v_existing_data, '$.writingModulesAccuracy');
        SET v_writing_modules = JSON_SET(
            v_writing_modules,
            CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_writing_module))),
            JSON_OBJECT(
                'totalCount', COALESCE(
                    JSON_UNQUOTE(JSON_EXTRACT(v_writing_modules, CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_writing_module)), '.totalCount'))),
                    0
                ) + 1,
                'correctCount', COALESCE(
                    JSON_UNQUOTE(JSON_EXTRACT(v_writing_modules, CONCAT('$.', JSON_UNQUOTE(JSON_QUOTE(p_writing_module)), '.correctCount'))),
                    0
                ) + IF(p_accuracy >= 80, 1, 0),
                'accuracy', 0, -- 将在后续计算
                'lastUpdateTime', NOW()
            )
        );
        SET v_updated_data = JSON_SET(v_updated_data, '$.writingModulesAccuracy', v_writing_modules);
    END IF;
    
    -- 更新近3次练习正确率历史
    SET v_recent_history = JSON_EXTRACT(v_existing_data, '$.recentAccuracyHistory');
    SET v_recent_history = JSON_ARRAY_APPEND(
        v_recent_history,
        '$',
        JSON_OBJECT(
            'practiceType', p_practice_type,
            'accuracy', p_accuracy,
            'timestamp', NOW()
        )
    );
    
    -- 保持最近3次记录
    IF JSON_LENGTH(v_recent_history) > 3 THEN
        SET v_recent_history = JSON_EXTRACT(v_recent_history, '$[1,2,3]');
    END IF;
    
    SET v_updated_data = JSON_SET(v_updated_data, '$.recentAccuracyHistory', v_recent_history);
    
    -- 更新数据库
    UPDATE UserAbilityProfile 
    SET daily_practice_score = v_updated_data
    WHERE user_id = p_user_id;
    
    SET v_result = TRUE;
    RETURN v_result;
END$$

-- 6. 创建触发器函数：动态更新能力等级
CREATE FUNCTION update_ability_level_dynamic(
    p_user_id VARCHAR(50),
    p_practice_type ENUM('grammar', 'writing')
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result BOOLEAN DEFAULT FALSE;
    DECLARE v_recent_accuracy JSON DEFAULT NULL;
    DECLARE v_current_level INT DEFAULT 1;
    DECLARE v_new_level INT DEFAULT 1;
    DECLARE v_level_up_standard JSON DEFAULT JSON_OBJECT('1', 40, '2', 60, '3', 80, '4', 90);
    DECLARE v_required_accuracy DECIMAL(5,2) DEFAULT 0;
    DECLARE v_all_meet_standard BOOLEAN DEFAULT TRUE;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_accuracy_value DECIMAL(5,2) DEFAULT 0;
    
    -- 获取近3次练习正确率
    SELECT JSON_EXTRACT(
        daily_practice_score,
        '$.recentAccuracyHistory[*].accuracy'
    ) INTO v_recent_accuracy
    FROM UserAbilityProfile 
    WHERE user_id = p_user_id;
    
    -- 检查是否有足够的数据
    IF JSON_LENGTH(v_recent_accuracy) < 3 THEN
        RETURN FALSE;
    END IF;
    
    -- 获取当前等级
    IF p_practice_type = 'grammar' THEN
        SELECT CASE 
            WHEN grammar_level = 'level1' THEN 1
            WHEN grammar_level = 'level2' THEN 2
            WHEN grammar_level = 'level3' THEN 3
            WHEN grammar_level = 'level4' THEN 4
            WHEN grammar_level = 'level5' THEN 5
            ELSE 1
        END INTO v_current_level
        FROM UserAbilityProfile 
        WHERE user_id = p_user_id;
    ELSE
        SELECT CASE 
            WHEN writing_level = 'level1' THEN 1
            WHEN writing_level = 'level2' THEN 2
            WHEN writing_level = 'level3' THEN 3
            WHEN writing_level = 'level4' THEN 4
            WHEN writing_level = 'level5' THEN 5
            ELSE 1
        END INTO v_current_level
        FROM UserAbilityProfile 
        WHERE user_id = p_user_id;
    END IF;
    
    -- 检查是否已达到最高等级
    IF v_current_level >= 5 THEN
        RETURN FALSE;
    END IF;
    
    -- 获取升级所需正确率
    SET v_required_accuracy = JSON_UNQUOTE(JSON_EXTRACT(v_level_up_standard, CONCAT('$."', v_current_level, '"')));
    
    -- 检查近3次练习是否都达到标准
    SET v_i = 0;
    WHILE v_i < 3 DO
        SET v_accuracy_value = JSON_UNQUOTE(JSON_EXTRACT(v_recent_accuracy, CONCAT('$[', v_i, ']')));
        IF v_accuracy_value < v_required_accuracy THEN
            SET v_all_meet_standard = FALSE;
            LEAVE WHILE;
        END IF;
        SET v_i = v_i + 1;
    END WHILE;
    
    -- 如果达到升级标准，更新等级
    IF v_all_meet_standard THEN
        SET v_new_level = v_current_level + 1;
        
        IF p_practice_type = 'grammar' THEN
            UPDATE UserAbilityProfile 
            SET grammar_level = CONCAT('level', v_new_level)
            WHERE user_id = p_user_id;
        ELSE
            UPDATE UserAbilityProfile 
            SET writing_level = CONCAT('level', v_new_level)
            WHERE user_id = p_user_id;
        END IF;
        
        -- 更新整体等级
        UPDATE UserAbilityProfile 
        SET overall_level = CONCAT('level', GREATEST(
            CASE WHEN grammar_level = 'level1' THEN 1
                 WHEN grammar_level = 'level2' THEN 2
                 WHEN grammar_level = 'level3' THEN 3
                 WHEN grammar_level = 'level4' THEN 4
                 WHEN grammar_level = 'level5' THEN 5
                 ELSE 1 END,
            CASE WHEN writing_level = 'level1' THEN 1
                 WHEN writing_level = 'level2' THEN 2
                 WHEN writing_level = 'level3' THEN 3
                 WHEN writing_level = 'level4' THEN 4
                 WHEN writing_level = 'level5' THEN 5
                 ELSE 1 END
        ))
        WHERE user_id = p_user_id;
        
        SET v_result = TRUE;
    END IF;
    
    RETURN v_result;
END$$

DELIMITER ;

-- 7. 创建使用示例和测试数据
-- 示例：同步语法功能大厅数据
-- SELECT sync_grammar_hall_data(
--     'user123',
--     'systemCombination',
--     JSON_OBJECT(
--         'accuracy', 85.5,
--         'highFreqErrors', JSON_ARRAY(
--             JSON_OBJECT('category', '定语从句', 'count', 3),
--             JSON_OBJECT('category', '非谓语动词', 'count', 2)
--         )
--     )
-- );

-- 示例：同步错题特训数据
-- SELECT sync_error_question_data(
--     'user123',
--     '非谓语动词时态错误',
--     75.0,
--     '时态判断错误'
-- );

-- 示例：更新日常练习实时分
-- SELECT update_daily_practice_score(
--     'user123',
--     'grammar',
--     88.5,
--     '定语从句',
--     NULL
-- );

-- 示例：动态更新能力等级
-- SELECT update_ability_level_dynamic('user123', 'grammar');

-- 8. 创建数据查询视图
CREATE VIEW v_user_ability_analytics AS
SELECT 
    user_id,
    grammar_level,
    writing_level,
    overall_level,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.systemCombination.practiceCount')) as system_combo_count,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.systemCombination.accuracy')) as system_combo_accuracy,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.grammarPoint.practiceCount')) as grammar_point_count,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.grammarPoint.accuracy')) as grammar_point_accuracy,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.customCombination.practiceCount')) as custom_combo_count,
    JSON_UNQUOTE(JSON_EXTRACT(grammar_hall_data, '$.customCombination.accuracy')) as custom_combo_accuracy,
    JSON_LENGTH(JSON_EXTRACT(error_question_data, '$.errorTypes')) as error_type_count,
    JSON_UNQUOTE(JSON_EXTRACT(error_question_data, '$.improvementTrend')) as improvement_trend,
    JSON_UNQUOTE(JSON_EXTRACT(daily_practice_score, '$.totalPracticeCount')) as total_practice_count,
    JSON_LENGTH(JSON_EXTRACT(daily_practice_score, '$.recentAccuracyHistory')) as recent_practice_count
FROM UserAbilityProfile;

-- 9. 创建性能优化建议
-- 建议定期清理过期的变式训练记录，保持数据量在合理范围内
-- 建议为经常查询的JSON字段创建虚拟列索引
-- 建议定期备份用户能力画像数据

COMMIT;
