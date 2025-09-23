// pages/grammar-test-sets/test.js
Page({
  data: {
    setId: null,
    setName: '',
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    showResult: false,
    score: 0,
    totalQuestions: 0,
    loading: true
  },

  onLoad: function (options) {
    const setId = parseInt(options.setId);
    const setName = decodeURIComponent(options.setName);
    
    this.setData({
      setId: setId,
      setName: setName
    });
    
    this.loadTestQuestions(setId);
  },

  loadTestQuestions: function (setId) {
    // 从本地数据加载测试题目
    const testData = this.getTestData(setId);
    
    if (testData) {
      this.setData({
        questions: testData.questions,
        totalQuestions: testData.questions.length,
        userAnswers: new Array(testData.questions.length).fill(''),
        loading: false
      });
    } else {
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },

  getTestData: function (setId) {
    // 这里应该从实际的数据源获取，现在使用硬编码数据
    const allSets = {
      1: {
        questions: [
          {
            text: "happiness的名词后缀是_____",
            answer: "ness",
            analysis: "像happiness这类表示抽象性质、状态的名词，常以ness为后缀，由形容词happy加ness构成。",
            tag: "名词后缀识别（一）"
          },
          {
            text: "你（you）的宾格形式是_____",
            answer: "you",
            analysis: "you的主格和宾格形式相同，在句子中作宾语时用you。",
            tag: "代词一（顺序）"
          },
          {
            text: "work的现在分词形式是_____",
            answer: "working",
            analysis: "一般情况下，动词变现在分词，直接在词尾加ing，work属于这种规则变化。",
            tag: "现在分词书写"
          },
          {
            text: "do的一般现在时第三人称单数形式是_____",
            answer: "does",
            analysis: "一般现在时中，以o、s、x、ch、sh结尾的动词，第三人称单数形式加es，do符合此规则，变为does。",
            tag: "时态书写"
          },
          {
            text: "eat的一般现在时被动写法中，be动词（主语为复数时）后接的形式是_____",
            answer: "eaten",
            analysis: "一般现在时被动语态结构为\"am/is/are + 过去分词\"，eat的过去分词是eaten，当主语为复数时，be动词用are，所以接eaten。",
            tag: "语态填表练习（一般现在时）"
          }
        ]
      },
      2: {
        questions: [
          {
            text: "development的名词后缀是_____",
            answer: "ment",
            analysis: "development由动词develop加后缀ment构成，ment常用来构成表示行为、结果等的名词。",
            tag: "名词后缀识别（二）"
          },
          {
            text: "我（I）的形容词性物主代词是_____",
            answer: "my",
            analysis: "形容词性物主代词用于修饰名词，I的形容词性物主代词是my，用来表示\"我的\"。",
            tag: "代词一（顺序）"
          },
          {
            text: "write的现在分词形式是_____",
            answer: "writing",
            analysis: "以不发音的e结尾的动词，变现在分词时要去掉e再加ing，write符合该规则，所以是writing。",
            tag: "现在分词书写"
          },
          {
            text: "work的一般过去时形式是_____",
            answer: "worked",
            analysis: "一般过去时中，规则动词通常在词尾加ed，work是规则动词，所以过去式为worked。",
            tag: "时态书写"
          },
          {
            text: "drink的一般现在时被动写法中，be动词（主语为单数时）后接的形式是_____",
            answer: "drunk",
            analysis: "一般现在时被动语态结构为\"am/is/are + 过去分词\"，drink的过去分词是drunk，当主语为单数时，be动词用is，所以接drunk。",
            tag: "语态填表练习（一般现在时）"
          }
        ]
      },
      3: {
        questions: [
          {
            text: "action的名词后缀是_____",
            answer: "ion",
            analysis: "action由动词act加后缀ion构成，ion常用来构成表示行为、状态等的名词。",
            tag: "名词后缀识别（三）"
          },
          {
            text: "他（he）的名词性物主代词是_____",
            answer: "his",
            analysis: "名词性物主代词相当于\"形容词性物主代词 + 名词\"，he的名词性物主代词是his，可单独使用表示\"他的（东西）\"。",
            tag: "代词一（顺序）"
          },
          {
            text: "run的现在分词形式是_____",
            answer: "running",
            analysis: "以重读闭音节结尾，且末尾只有一个辅音字母的动词，变现在分词时要双写这个辅音字母再加ing，run符合该规则，所以是running。",
            tag: "现在分词书写"
          },
          {
            text: "play的现在进行时形式（主语为I时）是_____",
            answer: "am playing",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，主语为I时，be动词用am，play的现在分词是playing，所以是am playing。",
            tag: "时态书写"
          },
          {
            text: "write的一般现在时被动写法中，be动词（主语为单数时）后接的形式是_____",
            answer: "written",
            analysis: "一般现在时被动语态结构为\"am/is/are + 过去分词\"，write的过去分词是written，当主语为单数时，be动词用is，所以接written。",
            tag: "语态填表练习（一般现在时）"
          }
        ]
      },
      4: {
        questions: [
          {
            text: "inventor的名词后缀是_____",
            answer: "or",
            analysis: "inventor表示\"发明者\"，由动词invent加后缀or构成，or常用来构成表示\"人\"的名词。",
            tag: "名词后缀识别（一）"
          },
          {
            text: "她（she）的反身代词是_____",
            answer: "herself",
            analysis: "反身代词用于强调主语自身，she的反身代词是herself，意为\"她自己\"。",
            tag: "代词一（顺序）"
          },
          {
            text: "lie（躺）的现在分词形式是_____",
            answer: "lying",
            analysis: "lie表示\"躺\"时，变现在分词属于特殊变化，要把ie变为y再加ing，所以是lying。",
            tag: "现在分词书写"
          },
          {
            text: "do的现在完成时形式（主语为you时）是_____",
            answer: "have done",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，主语为you时，用have，do的过去分词是done，所以是have done。",
            tag: "时态书写"
          },
          {
            text: "read的一般现在时被动写法中，be动词（主语为复数时）后接的形式是_____",
            answer: "read",
            analysis: "一般现在时被动语态结构为\"am/is/are + 过去分词\"，read的过去分词形式与原形相同，当主语为复数时，be动词用are，所以接read。",
            tag: "语态填表练习（一般现在时）"
          }
        ]
      },
      5: {
        questions: [
          {
            text: "childhood的名词后缀是_____",
            answer: "hood",
            analysis: "childhood表示\"童年\"，由child加后缀hood构成，hood常用来构成表示状态、性质等的名词。",
            tag: "名词后缀识别（三）"
          },
          {
            text: "我们（we）的宾格形式是_____",
            answer: "us",
            analysis: "we是主格形式，在句子中作宾语时要用宾格us。",
            tag: "代词一（顺序）"
          },
          {
            text: "be的现在分词形式是_____",
            answer: "being",
            analysis: "be属于特殊动词，其现在分词形式是being。",
            tag: "现在分词书写"
          },
          {
            text: "work的过去进行时形式（主语为he时）是_____",
            answer: "was working",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，主语为he时，用was，work的现在分词是working，所以是was working。",
            tag: "时态书写"
          },
          {
            text: "speak的一般现在时被动写法中，be动词（主语为单数时）后接的形式是_____",
            answer: "spoken",
            analysis: "一般现在时被动语态结构为\"am/is/are + 过去分词\"，speak的过去分词是spoken，当主语为单数时，be动词用is，所以接spoken。",
            tag: "语态填表练习（一般现在时）"
          }
        ]
      },
      6: {
        questions: [
          {
            text: "warmth的名词后缀是_____",
            answer: "th",
            analysis: "warmth表示\"温暖\"，由形容词warm加后缀th构成，th常用来构成表示状态、性质等的名词。",
            tag: "名词后缀识别（二）"
          },
          {
            text: "他们（they）的宾格形式是_____",
            answer: "them",
            analysis: "they是主格形式，在句子中作宾语时要用宾格them。",
            tag: "代词二（乱序）"
          },
          {
            text: "work的过去分词形式是_____",
            answer: "worked",
            analysis: "一般情况下，规则动词的过去分词与过去式变化规则相同，work是规则动词，过去式和过去分词都是worked。",
            tag: "过去分词书写"
          },
          {
            text: "eat的一般过去时写法是_____",
            answer: "ate",
            analysis: "eat是不规则动词，其一般过去时形式为ate，需要特殊记忆。",
            tag: "时态书写"
          },
          {
            text: "eat的一般将来时被动写法是_____",
            answer: "will be eaten",
            analysis: "一般将来时被动语态结构为\"will be + 过去分词\"，eat的过去分词是eaten，所以是will be eaten。",
            tag: "语态填表练习（一般将来时）"
          }
        ]
      },
      7: {
        questions: [
          {
            text: "development的名词后缀是_____",
            answer: "ment",
            analysis: "development由动词develop加后缀ment构成，ment常用来构成表示行为、结果等的名词。",
            tag: "名词后缀识别（三）"
          },
          {
            text: "她（she）的宾格形式是_____",
            answer: "her",
            analysis: "she是主格形式，在句子中作宾语时要用宾格her。",
            tag: "代词二（乱序）"
          },
          {
            text: "live的过去分词形式是_____",
            answer: "lived",
            analysis: "以不发音的e结尾的规则动词，变过去分词时直接加d，live符合该规则，所以过去分词是lived。",
            tag: "过去分词书写"
          },
          {
            text: "drink的一般过去时写法是_____",
            answer: "drank",
            analysis: "drink是不规则动词，其一般过去时形式为drank，需要特殊记忆。",
            tag: "时态书写"
          },
          {
            text: "drink的一般将来时被动写法是_____",
            answer: "will be drunk",
            analysis: "一般将来时被动语态结构为\"will be + 过去分词\"，drink的过去分词是drunk，所以是will be drunk。",
            tag: "语态填表练习（一般将来时）"
          }
        ]
      },
      8: {
        questions: [
          {
            text: "action的名词后缀是_____",
            answer: "ion",
            analysis: "action由动词act加后缀ion构成，ion常用来构成表示行为、状态等的名词。",
            tag: "名词后缀识别（一）"
          },
          {
            text: "你（you）的形容词性物主代词是_____",
            answer: "your",
            analysis: "形容词性物主代词用于修饰名词，you的形容词性物主代词是your，用来表示\"你的\"。",
            tag: "代词二（乱序）"
          },
          {
            text: "stop的过去分词形式是_____",
            answer: "stopped",
            analysis: "以重读闭音节结尾，且末尾只有一个辅音字母的动词，变过去分词时要双写这个辅音字母再加ed，stop符合该规则，所以是stopped。",
            tag: "过去分词书写"
          },
          {
            text: "write的一般过去时写法是_____",
            answer: "wrote",
            analysis: "write是不规则动词，其一般过去时形式为wrote，需要特殊记忆。",
            tag: "时态书写"
          },
          {
            text: "write的一般将来时被动写法是_____",
            answer: "will be written",
            analysis: "一般将来时被动语态结构为\"will be + 过去分词\"，write的过去分词是written，所以是will be written。",
            tag: "语态填表练习（一般将来时）"
          }
        ]
      },
      9: {
        questions: [
          {
            text: "pressure的名词后缀是_____",
            answer: "ure",
            analysis: "pressure表示\"压力\"，ure常作为名词后缀，用于构成抽象名词等，体现相关的状态或性质。",
            tag: "名词后缀识别（二）"
          },
          {
            text: "我们（we）的名词性物主代词是_____",
            answer: "ours",
            analysis: "名词性物主代词相当于\"形容词性物主代词 + 名词\"，we的形容词性物主代词是our，名词性物主代词为ours，可单独使用表示\"我们的（东西）\"。",
            tag: "代词二（乱序）"
          },
          {
            text: "study的过去分词形式是_____",
            answer: "studied",
            analysis: "以辅音字母 + y结尾的动词，变过去分词时，把y变为i再加ed，study符合该规则，所以是studied。",
            tag: "过去分词书写"
          },
          {
            text: "read的一般过去时写法是_____",
            answer: "read",
            analysis: "read是不规则动词，其一般过去时形式与原形拼写相同，但读音不同，需要特殊记忆。",
            tag: "时态书写"
          },
          {
            text: "read的一般将来时被动写法是_____",
            answer: "will be read",
            analysis: "一般将来时被动语态结构为\"will be + 过去分词\"，read的过去分词形式与原形相同，所以是will be read。",
            tag: "语态填表练习（一般将来时）"
          }
        ]
      },
      10: {
        questions: [
          {
            text: "importance的名词后缀是_____",
            answer: "ance",
            analysis: "importance表示\"重要性\"，由形容词important去t加ance构成，ance常作为名词后缀，用于构成抽象名词，体现相关的性质、状态等。",
            tag: "名词后缀识别（三）"
          },
          {
            text: "它（it）的反身代词是_____",
            answer: "itself",
            analysis: "反身代词用于强调主语自身，it的反身代词是itself，意为\"它自己\"。",
            tag: "代词二（乱序）"
          },
          {
            text: "do的过去分词形式是_____",
            answer: "done",
            analysis: "do是不规则动词，其过去分词形式为done，需要特殊记忆。",
            tag: "过去分词书写"
          },
          {
            text: "speak的一般过去时写法是_____",
            answer: "spoke",
            analysis: "speak是不规则动词，其一般过去时形式为spoke，需要特殊记忆。",
            tag: "时态书写"
          },
          {
            text: "speak的一般将来时被动写法是_____",
            answer: "will be spoken",
            analysis: "一般将来时被动语态结构为\"will be + 过去分词\"，speak的过去分词是spoken，所以是will be spoken。",
            tag: "语态填表练习（一般将来时）"
          }
        ]
      },
      11: {
        questions: [
          {
            text: "bus的复数形式是_____",
            answer: "buses",
            analysis: "以 -s 结尾的名词，变复数时通常加 -es，bus 符合该规则，所以复数形式是 buses。",
            tag: "规则变复数"
          },
          {
            text: "eat的过去将来时被动写法是_____",
            answer: "would be eaten",
            analysis: "过去将来时被动语态结构为\"would be + 过去分词\"，eat 的过去分词是 eaten，所以是 would be eaten。",
            tag: "语态填表练习（条件时态）"
          },
          {
            text: "drink的现在进行时写法是_____",
            answer: "am/is/are drinking",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，drink 的现在分词是 drinking，所以是 am/is/are drinking。",
            tag: "语态填表练习（现在进行时）"
          },
          {
            text: "write的过去进行时写法是_____",
            answer: "was/were writing",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，write 的现在分词是 writing，所以是 was/were writing。",
            tag: "语态填表练习（过去进行时）"
          },
          {
            text: "read的现在完成时写法是_____",
            answer: "have/has read",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，read 的过去分词与原形相同，所以是 have/has read。",
            tag: "语态填表练习（现在完成时）"
          }
        ]
      },
      12: {
        questions: [
          {
            text: "leaf的复数形式是_____",
            answer: "leaves",
            analysis: "以 -f 结尾的名词，变复数时通常把 f 改为 v 再加 -es，leaf 符合该规则，所以复数形式是 leaves。",
            tag: "规则变复数"
          },
          {
            text: "drink的过去将来时被动写法是_____",
            answer: "would be drunk",
            analysis: "过去将来时被动语态结构为\"would be + 过去分词\"，drink 的过去分词是 drunk，所以是 would be drunk。",
            tag: "语态填表练习（条件时态）"
          },
          {
            text: "write的现在进行时写法是_____",
            answer: "am/is/are writing",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，write 的现在分词是 writing，所以是 am/is/are writing。",
            tag: "语态填表练习（现在进行时）"
          },
          {
            text: "read的过去进行时写法是_____",
            answer: "was/were reading",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，read 的现在分词是 reading，所以是 was/were reading。",
            tag: "语态填表练习（过去进行时）"
          },
          {
            text: "drink的现在完成时写法是_____",
            answer: "have/has drunk",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，drink 的过去分词是 drunk，所以是 have/has drunk。",
            tag: "语态填表练习（现在完成时）"
          }
        ]
      },
      13: {
        questions: [
          {
            text: "knife的复数形式是_____",
            answer: "knives",
            analysis: "以 -fe 结尾的名词，变复数时通常把 fe 改为 v 再加 -es，knife 符合该规则，所以复数形式是 knives。",
            tag: "规则变复数"
          },
          {
            text: "write的过去将来时被动写法是_____",
            answer: "would be written",
            analysis: "过去将来时被动语态结构为\"would be + 过去分词\"，write 的过去分词是 written，所以是 would be written。",
            tag: "语态填表练习（条件时态）"
          },
          {
            text: "read的现在进行时写法是_____",
            answer: "am/is/are reading",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，read 的现在分词是 reading，所以是 am/is/are reading。",
            tag: "语态填表练习（现在进行时）"
          },
          {
            text: "drink的过去进行时写法是_____",
            answer: "was/were drinking",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，drink 的现在分词是 drinking，所以是 was/were drinking。",
            tag: "语态填表练习（过去进行时）"
          },
          {
            text: "write的现在完成时写法是_____",
            answer: "have/has written",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，write 的过去分词是 written，所以是 have/has written。",
            tag: "语态填表练习（现在完成时）"
          }
        ]
      },
      14: {
        questions: [
          {
            text: "factory的复数形式是_____",
            answer: "factories",
            analysis: "以\"辅音字母 + y\"结尾的名词，变复数时把 y 变为 i 再加 -es，factory 符合该规则，所以复数形式是 factories。",
            tag: "规则变复数"
          },
          {
            text: "read的过去将来时被动写法是_____",
            answer: "would be read",
            analysis: "过去将来时被动语态结构为\"would be + 过去分词\"，read 的过去分词与原形相同，所以是 would be read。",
            tag: "语态填表练习（条件时态）"
          },
          {
            text: "speak的现在进行时写法是_____",
            answer: "am/is/are speaking",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，speak 的现在分词是 speaking，所以是 am/is/are speaking。",
            tag: "语态填表练习（现在进行时）"
          },
          {
            text: "do的过去进行时写法是_____",
            answer: "was/were doing",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，do 的现在分词是 doing，所以是 was/were doing。",
            tag: "语态填表练习（过去进行时）"
          },
          {
            text: "speak的现在完成时写法是_____",
            answer: "have/has spoken",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，speak 的过去分词是 spoken，所以是 have/has spoken。",
            tag: "语态填表练习（现在完成时）"
          }
        ]
      },
      15: {
        questions: [
          {
            text: "hero的复数形式是_____",
            answer: "heroes",
            analysis: "以 -o 结尾的名词，有生命的一般加 -es，hero 属于有生命的，所以复数形式是 heroes。",
            tag: "规则变复数"
          },
          {
            text: "speak的过去将来时被动写法是_____",
            answer: "would be spoken",
            analysis: "过去将来时被动语态结构为\"would be + 过去分词\"，speak 的过去分词是 spoken，所以是 would be spoken。",
            tag: "语态填表练习（条件时态）"
          },
          {
            text: "do的现在进行时写法是_____",
            answer: "am/is/are doing",
            analysis: "现在进行时结构为\"am/is/are + 现在分词\"，do 的现在分词是 doing，所以是 am/is/are doing。",
            tag: "语态填表练习（现在进行时）"
          },
          {
            text: "make的过去进行时写法是_____",
            answer: "was/were making",
            analysis: "过去进行时结构为\"was/were + 现在分词\"，make 的现在分词是 making，所以是 was/were making。",
            tag: "语态填表练习（过去进行时）"
          },
          {
            text: "make的现在完成时写法是_____",
            answer: "have/has made",
            analysis: "现在完成时结构为\"have/has + 过去分词\"，make 的过去分词是 made，所以是 have/has made。",
            tag: "语态填表练习（现在完成时）"
          }
        ]
      },
      16: {
        questions: [
          {
            text: "unhappy, unfair, uncommon的形容词前缀是_____",
            answer: "un-",
            analysis: "un- 是常见的否定前缀，加在形容词前表示\"不……\"，unhappy（不开心的）、unfair（不公平的）、uncommon（不常见的）都以 un- 为前缀。",
            tag: "形容词前后缀识别"
          },
          {
            text: "fast的比较级形式是_____",
            answer: "faster",
            analysis: "单音节形容词变比较级，一般直接加 -er，fast 符合该规则，所以比较级是 faster。",
            tag: "比较级书写"
          },
          {
            text: "fast的最高级形式是_____",
            answer: "fastest",
            analysis: "单音节形容词变最高级，一般直接加 -est，fast 符合该规则，所以最高级是 fastest。",
            tag: "最高级书写"
          },
          {
            text: "speak的过去完成时被动写法是_____",
            answer: "had been spoken",
            analysis: "过去完成时被动语态结构为\"had been + 过去分词\"，speak 的过去分词是 spoken，所以是 had been spoken。",
            tag: "语态填表练习（过去完成时）"
          },
          {
            text: "quick的副词形式是_____",
            answer: "quickly",
            analysis: "一般情况下，形容词变副词直接加 -ly，quick 符合该规则，所以副词形式是 quickly。",
            tag: "形容词变副词书写"
          }
        ]
      },
      17: {
        questions: [
          {
            text: "impossible, impolite, improper的形容词前缀是_____",
            answer: "im-",
            analysis: "im- 是常见的否定前缀，常加在以 p、m、b 开头的形容词前表示\"不……\"，impossible（不可能的）、impolite（不礼貌的）、improper（不合适的）均符合此规则。",
            tag: "形容词前后缀识别"
          },
          {
            text: "happy的比较级形式是_____",
            answer: "happier",
            analysis: "以\"辅音字母 + y\"结尾的双音节形容词，变比较级时需把 y 变为 i 再加 -er，happy 符合该规则，所以比较级是 happier。",
            tag: "比较级书写"
          },
          {
            text: "happy的最高级形式是_____",
            answer: "happiest",
            analysis: "以\"辅音字母 + y\"结尾的双音节形容词，变最高级时需把 y 变为 i 再加 -est，happy 符合该规则，所以最高级是 happiest。",
            tag: "最高级书写"
          },
          {
            text: "write的过去完成时被动写法是_____",
            answer: "had been written",
            analysis: "过去完成时被动语态结构为\"had been + 过去分词\"，write 的过去分词是 written，所以是 had been written。",
            tag: "语态填表练习（过去完成时）"
          },
          {
            text: "true的副词形式是_____",
            answer: "truly",
            analysis: "以不发音的 e 结尾的形容词变副词，需先去 e 再加 -ly，true 符合该规则，所以副词形式是 truly。",
            tag: "形容词变副词书写"
          }
        ]
      },
      18: {
        questions: [
          {
            text: "illegal, illogical, illiterate的形容词前缀是_____",
            answer: "il-",
            analysis: "il- 是常见的否定前缀，常加在以 l 开头的形容词前表示\"不……\"，illegal（非法的）、illogical（不合逻辑的）、illiterate（不识字的）均符合此规则。",
            tag: "形容词前后缀识别"
          },
          {
            text: "big的比较级形式是_____",
            answer: "bigger",
            analysis: "以重读闭音节结尾且末尾只有一个辅音字母的形容词，变比较级时要双写该辅音字母再加 -er，big 符合该规则，所以比较级是 bigger。",
            tag: "比较级书写"
          },
          {
            text: "big的最高级形式是_____",
            answer: "biggest",
            analysis: "以重读闭音节结尾且末尾只有一个辅音字母的形容词，变最高级时要双写该辅音字母再加 -est，big 符合该规则，所以最高级是 biggest。",
            tag: "最高级书写"
          },
          {
            text: "read的过去完成时被动写法是_____",
            answer: "had been read",
            analysis: "过去完成时被动语态结构为\"had been + 过去分词\"，read 的过去分词与原形相同，所以是 had been read。",
            tag: "语态填表练习（过去完成时）"
          },
          {
            text: "terrible的副词形式是_____",
            answer: "terribly",
            analysis: "以 -le 结尾的形容词变副词，需去 e 再加 -y，terrible 符合该规则，所以副词形式是 terribly。",
            tag: "形容词变副词书写"
          }
        ]
      },
      19: {
        questions: [
          {
            text: "irregular, irresponsible, irrelevant的形容词前缀是_____",
            answer: "ir-",
            analysis: "ir- 是常见的否定前缀，常加在以 r 开头的形容词前表示\"不……\"，irregular（不规则的）、irresponsible（不负责任的）、irrelevant（不相关的）均符合此规则。",
            tag: "形容词前后缀识别"
          },
          {
            text: "good的比较级形式是_____",
            answer: "better",
            analysis: "good 是不规则形容词，其比较级为特殊形式 better，需要单独记忆。",
            tag: "比较级书写"
          },
          {
            text: "good的最高级形式是_____",
            answer: "best",
            analysis: "good 是不规则形容词，其最高级为特殊形式 best，需要单独记忆。",
            tag: "最高级书写"
          },
          {
            text: "do的过去完成时被动写法是_____",
            answer: "had been done",
            analysis: "过去完成时被动语态结构为\"had been + 过去分词\"，do 的过去分词是 done，所以是 had been done。",
            tag: "语态填表练习（过去完成时）"
          },
          {
            text: "basic的副词形式是_____",
            answer: "basically",
            analysis: "以 -ic 结尾的形容词变副词，需加 -ally，basic 符合该规则，所以副词形式是 basically。",
            tag: "形容词变副词书写"
          }
        ]
      },
      20: {
        questions: [
          {
            text: "inactive, incorrect, incomplete的形容词前缀是_____",
            answer: "in-",
            analysis: "in- 是常见的否定前缀，加在形容词前表示\"不……\"，inactive（不活跃的）、incorrect（不正确的）、incomplete（不完整的）都以 in- 为前缀。",
            tag: "形容词前后缀识别"
          },
          {
            text: "bad的比较级形式是_____",
            answer: "worse",
            analysis: "bad 是不规则形容词，其比较级为特殊形式 worse，需要单独记忆。",
            tag: "比较级书写"
          },
          {
            text: "bad的最高级形式是_____",
            answer: "worst",
            analysis: "bad 是不规则形容词，其最高级为特殊形式 worst，需要单独记忆。",
            tag: "最高级书写"
          },
          {
            text: "make的过去完成时被动写法是_____",
            answer: "had been made",
            analysis: "过去完成时被动语态结构为\"had been + 过去分词\"，make 的过去分词是 made，所以是 had been made。",
            tag: "语态填表练习（过去完成时）"
          },
          {
            text: "hard的副词形式是_____",
            answer: "hard",
            analysis: "有些形容词本身就可作副词，hard 属于此类，其副词形式与形容词形式相同。",
            tag: "形容词变副词书写"
          }
        ]
      }
    };
    
    return allSets[setId];
  },

  onInputChange: function (e) {
    const value = e.detail.value;
    const userAnswers = this.data.userAnswers;
    userAnswers[this.data.currentIndex] = value;
    
    this.setData({
      userAnswers: userAnswers
    });
  },

  onNextQuestion: function () {
    if (this.data.currentIndex < this.data.totalQuestions - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1
      });
    } else {
      this.submitTest();
    }
  },

  onPrevQuestion: function () {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1
      });
    }
  },

  submitTest: function () {
    let score = 0;
    const questions = this.data.questions;
    const userAnswers = this.data.userAnswers;
    
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i].trim().toLowerCase() === questions[i].answer.toLowerCase()) {
        score++;
      }
    }
    
    this.setData({
      score: score,
      showResult: true
    });
  },

  onRetry: function () {
    this.setData({
      currentIndex: 0,
      userAnswers: new Array(this.data.totalQuestions).fill(''),
      showResult: false,
      score: 0
    });
  },

  onBackToList: function () {
    wx.navigateBack();
  },

  onShareAppMessage: function () {
    return {
      title: `${this.data.setName} - 语法测试`,
      path: `/pages/grammar-test-sets/test?setId=${this.data.setId}&setName=${encodeURIComponent(this.data.setName)}`
    };
  }
});
