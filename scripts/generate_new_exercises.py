import json
import hashlib
from datetime import datetime

def generate_id(text):
    """生成唯一ID"""
    return hashlib.md5(text.encode()).hexdigest()

def create_exercise(text, answer, analysis, grammar_point, hint=None, category=None):
    """创建习题对象"""
    # 如果有提示词，将其添加到第一个下划线后
    if hint:
        text = text.replace("____", f"____ ({hint})", 1)  # 只替换第一个
    
    exercise_id = generate_id(text + answer)
    now = datetime.now().isoformat() + "Z"
    
    # 如果没有提供category，使用grammar_point作为category
    if category is None:
        category = grammar_point
    
    return {
        "_id": exercise_id,
        "text": text,
        "answer": answer,
        "analysis": analysis,
        "category": category,
        "grammarPoint": grammar_point,
        "source": "import",
        "createdAt": now,
        "updatedAt": now,
        "schoolLevel": "high"
    }

exercises = []

# 第一批次：人称代词（12题）
batch1 = [
    ("When the teacher asked about the homework, Li Hua and Zhang Wei looked at each other, neither of ____ daring to say a word.", "them", "them为人称代词宾格,在介词of后作宾语,指代前面的\"Li Hua and Zhang Wei\"。", "人称代词", "we"),
    ("As teenagers, ____ should learn to take responsibility for our own choices instead of relying on parents all the time.", "we", "we为人称代词主格,在句中作主语,指代\"teenagers\"(青少年)。", "人称代词", None),
    ("The new library has a lot of interesting books, and most of ____ are suitable for senior high school students to read after class.", "them", "them为人称代词宾格,在介词of后作宾语,指代前面的\"books\"。", "人称代词", None),
    ("My deskmate is good at math, so I often turn to ____ for help when I meet difficult problems in calculations.", "him", "him为人称代词宾格,在介词to后作宾语,指代前面的\"deskmate\"(同桌)。", "人称代词", "he"),
    ("This book is not mine; it must be ____, for I saw her name on the cover yesterday.", "hers", "hers为名词性物主代词,在句中作表语,相当于\"her book\",表示\"她的(书)\"。", "人称代词", None),
    ("If you don't believe in ____, no one else will trust you in the long run.", "yourself", "yourself为反身代词,在介词in后作宾语,表示\"你自己\",强调动作的承受者是动作的执行者本身。", "人称代词", "you"),
    ("The little boy finished the difficult puzzle by ____ without any help from his parents, which surprised everyone around him.", "himself", "himself为反身代词,在介词by后作宾语,表示\"他自己\",强调\"独自完成\"。", "人称代词", None),
    ("The volunteers spent a whole day helping the elderly clean their houses, and ____ were deeply moved by the volunteers' kindness.", "they", "they为人称代词主格,在句中作主语,指代前面的\"the elderly\"(老年人)。", "人称代词", "they"),
    ("I left my notebook in the classroom yesterday, but I can't find ____ anywhere this morning. Did anyone pick it up?", "it", "it为人称代词,在句中作宾语,指代前面的\"notebook\"。", "人称代词", None),
    ("My parents always tell me that happiness is something that ____ have to create by ourselves, not something that can be given by others.", "I", "I为人称代词主格,在句中作主语,与后面的\"ourselves\"呼应,表示\"我\"。", "人称代词", "I"),
    ("The two sisters have different hobbies; one likes painting and ____ prefers playing the piano.", "the other", "the other为不定代词,指代\"两个中的另一个\",与前面的\"one\"形成对应。", "人称代词", None),
    ("The machine is easy to operate, and you can learn to use ____ by following the instructions on the box.", "it", "it为人称代词,在句中作宾语,指代前面的\"machine\"。", "人称代词", "it"),
]

# 第二批次：连词与名/动/形/副综合（20题）
batch2 = [
    ("Reading widely can not only enrich our knowledge, ____ also shape our thinking and personality in the long term.", "but", "but为并列连词,与前面的\"not only\"构成\"not only...but also...\"结构,表示\"不仅...而且...\"。", "连词", None),
    ("A ____ rain stopped the students from having their sports meeting on the playground as planned.", "sudden", "sudden为形容词,修饰名词\"rain\",表示\"突然的雨\"。", "形容词", "sudden"),
    ("The old man ____ has been living in this village for over 60 years knows every story about its history and culture.", "who/that", "who/that为关系代词,引导定语从句修饰\"old man\",在从句中作主语。", "定语从句", None),
    ("After months of hard training, the girl ____ in passing the important piano examination last week.", "succeeded", "succeeded为动词过去式,与介词in构成固定搭配\"succeed in doing\",表示\"成功做某事\"。", "动词", "success"),
    ("We have to finish our research report before Friday, ____ we will miss the chance to present it at the school meeting.", "or", "or为并列连词,表示\"否则\",连接两个并列的句子。", "连词", None),
    ("The children are playing ____ in the park, with their laughter spreading everywhere.", "happily", "happily为副词,修饰动词\"playing\",表示\"快乐地玩耍\"。", "副词", "happy"),
    ("____ the sun was shining brightly, the wind was still cold in early spring and we all wore thick coats.", "Although/Though/While", "Although/Though/While为让步连词,引导让步状语从句,表示\"尽管...但是...\"。", "连词", None),
    ("It's important for teenagers to take ____ to protect the environment around us in daily life.", "action(s)", "action为名词,与动词take构成固定搭配\"take action\",表示\"采取行动\"。", "名词", "act"),
    ("The library ____ we often go to read on weekends has just bought a lot of new books and magazines.", "where/which/that", "where/which/that为关系代词,引导定语从句修饰\"library\"。where在从句中作地点状语,which/that在从句中作宾语。", "定语从句", None),
    ("You must do your homework ____ to avoid making unnecessary mistakes in the exam.", "carefully", "carefully为副词,修饰动词\"do\",表示\"仔细地做作业\"。", "副词", "careful"),
    ("Many students choose to take part in volunteer activities during holidays, ____ they can learn to help others and improve themselves at the same time.", "for/because", "for/because为原因连词,引导原因状语从句,表示\"因为\"。", "连词", None),
    ("The more we communicate with our parents, the ____ the distance between our hearts will become.", "shorter", "shorter为形容词比较级,与前面的\"the more\"构成\"the more...the more...\"结构,表示\"越...越...\"。", "形容词比较级", "long"),
    ("____ you put your heart into your study, you will surely make great progress no matter how difficult it is.", "If/When", "If/When为条件/时间连词,引导条件/时间状语从句,表示\"如果/当你...\"。", "连词", None),
    ("There are many ____ between the two traditional festivals in different parts of our country.", "differences", "differences为名词复数,表示\"不同之处\"。", "名词", "different"),
    ("The little girl was crying loudly ____ she couldn't find her mother in the crowded supermarket.", "because/as/since", "because/as/since为原因连词,引导原因状语从句,表示\"因为\"。", "连词", None),
    ("He left home earlier than ____ this morning because he had to catch the first bus to school.", "usual", "usual为形容词,与than构成固定搭配\"than usual\",表示\"比平时\"。", "形容词", "usual"),
    ("The book ____ cover is light blue is a gift from my English teacher on my birthday.", "whose", "whose为关系代词,引导定语从句修饰\"book\",在从句中作定语,表示\"书的封面\"。", "定语从句", None),
    ("The young artist has a ____ mind and he always comes up with unique ideas for his paintings.", "creative", "creative为形容词,修饰名词\"mind\",表示\"有创造力的头脑\"。", "形容词", "create"),
    ("We didn't go for a picnic yesterday, ____ the weather was too bad and it rained heavily all day.", "because", "because为原因连词,引导原因状语从句,表示\"因为\"。", "连词", None),
    ("English is one of the most important ____ languages in the world and it's necessary for us to master it.", "spoken", "spoken为过去分词作形容词,修饰名词\"languages\",表示\"被说的语言\"。", "过去分词", "speak"),
]

# 第三批次：复合词与外来词（20题）
batch3 = [
    ("After school, I usually go to the ____ near our community to buy some exercise books and stationery.（合成名词）", "bookstore", "bookstore为合成名词,由book(书)和store(商店)组成,表示\"书店\"。", "复合词", "home"),
    ("We should love our ____ and do what we can to protect its natural environment.（合成名词）", "homeland", "homeland为合成名词,由home(家)和land(土地)组成,表示\"祖国,家乡\"。", "复合词", None),
    ("We ordered a ____ and a cup of coffee in the small shop on the street corner when we were tired.（外来词，饮食类）", "pizza", "pizza为外来词,来自意大利语,表示\"披萨\"。", "外来词", None),
    ("My English teacher always tells us to keep a ____ diary to improve our writing skills.（合成形容词）", "everyday", "everyday为合成形容词,由every(每)和day(天)组成,表示\"每天的,日常的\"。", "复合词", "every"),
    ("The ____ train from our city to the capital only takes two hours, which is very convenient.（合成形容词）", "high-speed", "high-speed为合成形容词,由high(高)和speed(速度)组成,表示\"高速的\"。", "复合词", None),
    ("She likes watching ____ in her free time and her favorite one is Swan Lake.（外来词，文化类）", "ballet", "ballet为外来词,来自法语,表示\"芭蕾舞\"。", "外来词", None),
    ("The ____ through the window made the small room warm and bright in the morning.（合成名词）", "sunshine", "sunshine为合成名词,由sun(太阳)和shine(光)组成,表示\"阳光\"。", "复合词", "sun"),
    ("My deskmate is a ____ friend and she always helps me when I meet difficulties in study.（合成形容词）", "true-hearted", "true-hearted为合成形容词,由true(真实的)和hearted(有...心的)组成,表示\"真诚的\"。", "复合词", None),
    ("We can see a lot of delicious ____ in the Japanese restaurant near the school gate.（外来词，饮食类）", "sushi", "sushi为外来词,来自日语,表示\"寿司\"。", "外来词", None),
    ("All the ____ in our grade took part in the sports meeting held last month.（合成名词）", "classmates", "classmates为合成名词,由class(班级)和mates(伙伴)组成,表示\"同班同学\"。", "复合词", "class"),
    ("The old man lives ____ near the park, so he can take a walk there every morning.（合成副词）", "somewhere", "somewhere为合成副词,由some(某)和where(地方)组成,表示\"某处\"。", "复合词", None),
    ("I need to look up the new word in the ____, or I can't understand the sentence in the passage.（合成名词）", "dictionary", "dictionary为合成名词,由diction(措辞)和ary(场所)组成,表示\"词典\"。", "复合词", None),
    ("My sister found a ____ job in a company after graduating from college.（合成形容词）", "full-time", "full-time为合成形容词,由full(全)和time(时间)组成,表示\"全职的\"。", "复合词", "full"),
    ("The waiter handed us a ____ and we chose some dishes we liked for dinner.（外来词，餐饮类）", "menu", "menu为外来词,来自法语,表示\"菜单\"。", "外来词", None),
    ("There is a small ____ in our school where we can buy some snacks and drinks.（合成名词）", "snackbar", "snackbar为合成名词,由snack(零食)和bar(吧)组成,表示\"小吃店\"。", "复合词", None),
    ("I left my pen ____ in the classroom, but I can't find it now.（合成副词）", "somewhere", "somewhere为合成副词,由some(某)和where(地方)组成,表示\"某处\"。", "复合词", "some"),
    ("We enjoyed the sweet ____ and beautiful music at the party last night.（外来词，饮食类）", "chocolate", "chocolate为外来词,来自西班牙语,表示\"巧克力\"。", "外来词", "black"),
    ("The teacher wrote down the key points on the ____ with a white chalk in the class.（合成名词）", "blackboard", "blackboard为合成名词,由black(黑)和board(板)组成,表示\"黑板\"。", "复合词", None),
    ("The ____ jacket he is wearing looks very cool and it's popular among teenagers now.（外来词，服饰类）", "jeans", "jeans为外来词,表示\"牛仔裤\"。", "外来词", None),
    ("____, we should finish our homework on time and never put it off until tomorrow.（合成副词）", "Anyway", "Anyway为合成副词,由any(任何)和way(方式)组成,表示\"无论如何\"。", "复合词", "any"),
]

# 第四批次：单复数同形（20题）
batch4 = [
    ("There are many ____ in the nature reserve on the edge of our city, well protected by the local government.", "deer", "deer为单复数同形名词,表示\"鹿\"。", "单复数同形", "deer"),
    ("The farmer raised a group of ____ on the mountain, and their wool is of very good quality.", "sheep", "sheep为单复数同形名词,表示\"羊\"。", "单复数同形", "sheep"),
    ("We can see different ____ of rare fish in the underwater world museum, which amazes all the visitors.", "species", "species为单复数同形名词,表示\"种类\"。", "单复数同形", None),
    ("The fisherman caught several big ____ in the lake this morning and decided to set them free.", "fish", "fish为单复数同形名词,表示\"鱼\"。", "单复数同形", "fish"),
    ("Every possible ____ has been tried to solve the problem of water shortage in the small village.", "means", "means为单复数同形名词,表示\"方法\"。", "单复数同形", None),
    ("A new ____ of English learning videos has been put online and is popular among senior high school students.", "series", "series为单复数同形名词,表示\"系列\"。", "单复数同形", "series"),
    ("Many foreign ____ living abroad still keep the habit of celebrating traditional Chinese festivals.", "Chinese", "Chinese为单复数同形名词,表示\"中国人\"。", "单复数同形", "Chinese"),
    ("This kind of ____ can fly in all kinds of bad weather and is widely used in air transportation.", "aircraft", "aircraft为单复数同形名词,表示\"飞机\"。", "单复数同形", None),
    ("Some ____ teachers came to our school for educational exchange and gave us interesting English lessons.", "Japanese", "Japanese为单复数同形名词,表示\"日本人\"。", "单复数同形", "Japanese"),
    ("More and more new ____ of plants are discovered in the rainforest every year by scientists.", "species", "species为单复数同形名词,表示\"种类\"。", "单复数同形", None),
    ("China has sent many advanced ____ into space and made great achievements in aerospace.", "spacecraft", "spacecraft为单复数同形名词,表示\"航天器\"。", "单复数同形", "spacecraft"),
    ("All the ____ in our class took part in the Chinese poetry recitation contest and won the first prize.", "Chinese", "Chinese为单复数同形名词,表示\"中国人\"。", "单复数同形", None),
    ("Taking public transport is one of the green ____ of going out and it can reduce air pollution.", "means", "means为单复数同形名词,表示\"方法\"。", "单复数同形", "means"),
    ("The military ____ parked on the airport tarmac is ready for the training mission at any time.", "aircraft", "aircraft为单复数同形名词,表示\"飞机\"。", "单复数同形", None),
    ("A few ____ artists held a painting exhibition in our city and attracted a lot of art lovers.", "Swiss", "Swiss为单复数同形名词,表示\"瑞士人\"。", "单复数同形", "Swiss"),
    ("A ____ of lectures on environmental protection will be held in our school next month.", "series", "series为单复数同形名词,表示\"系列\"。", "单复数同形", None),
    ("If you look carefully, you can see a lot of small ____ swimming in the clear river in the park.", "fish", "fish为单复数同形名词,表示\"鱼\"。", "单复数同形", "fish"),
    ("The local people use various ____ to keep their traditional culture alive from generation to generation.", "means", "means为单复数同形名词,表示\"方法\"。", "单复数同形", None),
    ("Our country has the ability to design and make all kinds of ____ independently now.", "aircraft", "aircraft为单复数同形名词,表示\"飞机\"。", "单复数同形", "aircraft"),
    ("Those rare ____ living in the wetland are under strict protection by the local environmental department.", "deer", "deer为单复数同形名词,表示\"鹿\"。", "单复数同形", None),
]

# 第五批次：不规则复数（20题）
batch5 = [
    ("Many ____ in the neighborhood take part in the weekend reading club to develop their reading habits.", "children", "children为child的不规则复数形式,表示\"孩子们\"。", "不规则复数", "child"),
    ("Several ____ volunteers helped move the heavy books to the new library and refused to accept any thanks.", "men", "men为man的不规则复数形式,表示\"男人们\"。", "不规则复数", "man"),
    ("She has to wear comfortable ____ for the long walk, or her feet will get sore on the way.", "feet", "feet为foot的不规则复数形式,表示\"脚\"。", "不规则复数", None),
    ("The little boy brushed his ____ carefully every morning and evening, so he has no bad teeth at all.", "teeth", "teeth为tooth的不规则复数形式,表示\"牙齿\"。", "不规则复数", "tooth"),
    ("Some ____ doctors in the hospital volunteered to go to the mountain village to give free medical treatment to the villagers.", "women", "women为woman的不规则复数形式,表示\"女医生们\"。", "不规则复数", "woman"),
    ("The old house is empty for years and there are some ____ running around in the corner at night.", "mice", "mice为mouse的不规则复数形式,表示\"老鼠\"。", "不规则复数", None),
    ("With the development of society, more and more strange ____ in nature are being explained by science.", "phenomena", "phenomena为phenomenon的不规则复数形式,表示\"现象\"。", "不规则复数", "phenomenon"),
    ("A group of ____ are swimming on the lake in the park, and they look very lovely in the sunshine.", "geese", "geese为goose的不规则复数形式,表示\"鹅\"。", "不规则复数", "goose"),
    ("He hurt his ____ when playing basketball yesterday, so he has to walk with a stick these days.", "foot/feet", "foot/feet为foot的单复数形式,表示\"脚\"。", "不规则复数", None),
    ("The teachers made several new ____ for judging the students' comprehensive quality this term.", "criteria", "criteria为criterion的不规则复数形式,表示\"标准\"。", "不规则复数", "criterion"),
    ("The local farmers used to raise ____ to help them plough the fields in the past.", "oxen", "oxen为ox的不规则复数形式,表示\"牛\"。", "不规则复数", "ox"),
    ("The little girl was so scared that she cried when she saw two small ____ in the grass behind the house.", "mice", "mice为mouse的不规则复数形式,表示\"老鼠\"。", "不规则复数", None),
    ("Different ____ such as TV, radio and the Internet are used to spread traditional culture now.", "media", "media为medium的不规则复数形式,表示\"媒体\"。", "不规则复数", "medium"),
    ("The computer room bought a few new ____ to replace the broken ones for students' study.", "mice", "mice为mouse的不规则复数形式,表示\"鼠标\"。", "不规则复数", "mouse"),
    ("The ground is covered with yellow ____ in autumn, making the park look very beautiful.", "leaves", "leaves为leaf的不规则复数形式,表示\"叶子\"。", "不规则复数", "leaf"),
    ("We need to take a few sharp ____ to cut the fruit for the picnic this weekend.", "knives", "knives为knife的不规则复数形式,表示\"刀\"。", "不规则复数", "knife"),
    ("Many brave people risk their ____ to protect the wild animals in the dangerous rainforest.", "lives", "lives为life的不规则复数形式,表示\"生命\"。", "不规则复数", "life"),
    ("The students measured their ____ and heights in the physical examination held last week.", "feet", "feet为foot的不规则复数形式,表示\"脚\"。", "不规则复数", None),
    ("The cake is too big, so we cut it into four ____ and shared it with each other.", "halves", "halves为half的不规则复数形式,表示\"一半\"。", "不规则复数", "half"),
    ("Many unknown ____ have made great contributions to our country's development and we should remember them forever.", "heroes", "heroes为hero的不规则复数形式,表示\"英雄\"。", "不规则复数", "hero"),
]

# 第六批次：以o/y/s/sh/ch/x结尾（5题）
batch6 = [
    ("We bought some fresh ____ from the community market to make tomato and egg soup for dinner tonight.（以o结尾）", "tomatoes", "tomatoes为tomato的复数形式,以o结尾的名词变复数时加es,表示\"西红柿\"。", "名词复数", "tomato"),
    ("She took a lot of beautiful ____ when she traveled to the ancient town during the National Day holiday.（以o结尾）", "photos", "photos为photo的复数形式,以o结尾的名词变复数时加s,表示\"照片\"。", "名词复数", "photo"),
    ("The cook cut up several big ____ and fried them with beef for the students' lunch in the school canteen.（以o结尾）", "potatoes", "potatoes为potato的复数形式,以o结尾的名词变复数时加es,表示\"土豆\"。", "名词复数", "potato"),
    ("The kind young nurse looked after several lovely ____ in the hospital ward and all the parents thanked her sincerely.（以y结尾）", "babies", "babies为baby的复数形式,以辅音字母+y结尾的名词变复数时变y为i加es,表示\"婴儿\"。", "名词复数", "baby"),
    ("We need to prepare some paper ____ to store the old textbooks and exercise books in the classroom.（s/sh/ch/x结尾）", "boxes", "boxes为box的复数形式,以s/sh/ch/x结尾的名词变复数时加es,表示\"盒子\"。", "名词复数", "box"),
]

# 第七批次：以f/fe结尾（20题）
batch7 = [
    ("Some ____ are often seen in the forest at the foot of the mountain, so local people are warned not to go there alone.", "wolves", "wolves为wolf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"狼\"。", "名词复数", "wolf"),
    ("The kind man prepared a big surprise for his wife on their wedding anniversary, and all his friends and ____ came to celebrate together.", "wives", "wives为wife的复数形式,以fe结尾的名词变复数时变fe为v加es,表示\"妻子们\"。", "名词复数", "wife"),
    ("We need to buy a few new ____ for the classroom to put the reference books and exercise books in order.", "shelves", "shelves为shelf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"架子\"。", "名词复数", "shelf"),
    ("The apple pie is too big for one person, so we cut it into six ____ and shared it with our deskmates.", "halves", "halves为half的复数形式,以f结尾的名词变复数时变f为v加es,表示\"一半\"。", "名词复数", "half"),
    ("In late autumn, the ground of the campus is covered with golden ____, which is a beautiful scene for us to enjoy.", "leaves", "leaves为leaf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"叶子\"。", "名词复数", "leaf"),
    ("The police caught the two ____ who stole things in the community supermarket and handed them over to the relevant department.", "thieves", "thieves为thief的复数形式,以f结尾的名词变复数时变f为v加es,表示\"小偷\"。", "名词复数", "thief"),
    ("Teenagers should learn to know their own ____ and accept their shortcomings while developing their advantages.", "selves", "selves为self的复数形式,以f结尾的名词变复数时变f为v加es,表示\"自己\"。", "名词复数", "self"),
    ("My mother bought three ____ of bread from the bakery near our home for our breakfast tomorrow morning.", "loaves", "loaves为loaf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"条\"。", "名词复数", "loaf"),
    ("Several lovely ____ are running on the grassland with their mothers, and the scene looks very warm and lively.", "calves", "calves为calf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"小牛\"。", "名词复数", "calf"),
    ("Many students wear thick ____ in winter to keep their necks warm when walking to school.", "scarves/scarfs", "scarves/scarfs为scarf的复数形式,可以变f为v加es或直接加s,表示\"围巾\"。", "名词复数", "scarf"),
    ("The ____ of several old houses in the village were repaired by the government, making them safer to live in.", "roofs", "roofs为roof的复数形式,以f结尾的名词变复数时直接加s,表示\"屋顶\"。", "名词复数", "roof"),
    ("Many brave firefighters risk their ____ to put out the fire and save the people in danger every year.", "lives", "lives为life的复数形式,以fe结尾的名词变复数时变fe为v加es,表示\"生命\"。", "名词复数", "life"),
    ("We need to take a few sharp ____ to cut the watermelon and other fruits for the class picnic this weekend.", "knives", "knives为knife的复数形式,以fe结尾的名词变复数时变fe为v加es,表示\"刀\"。", "名词复数", "knife"),
    ("The scientist showed several solid ____ to prove his new discovery in the field of biology at the meeting.", "proofs", "proofs为proof的复数形式,以f结尾的名词变复数时直接加s,表示\"证据\"。", "名词复数", "proof"),
    ("Several ____ of the company came to our school to talk with students about career planning and job hunting.", "chiefs", "chiefs为chief的复数形式,以f结尾的名词变复数时直接加s,表示\"负责人\"。", "名词复数", "chief"),
    ("The ____ between different generations can be narrowed by more communication and understanding.", "gulfs", "gulfs为gulf的复数形式,以f结尾的名词变复数时直接加s,表示\"鸿沟\"。", "名词复数", "gulf"),
    ("The children are very interested in the story about the ____ who live in the magic forest and have special powers.", "elves", "elves为elf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"精灵\"。", "名词复数", "elf"),
    ("The farmer tied the wheat into several ____ and put them in the barn after the harvest.", "sheaves", "sheaves为sheaf的复数形式,以f结尾的名词变复数时变f为v加es,表示\"捆\"。", "名词复数", "sheaf"),
    ("The workers checked all the ____ in the factory to ensure the safety of the employees during work.", "safes", "safes为safe的复数形式,以e结尾的名词变复数时直接加s,表示\"保险箱\"。", "名词复数", "safe"),
    ("My grandmother still keeps some clean ____ in her drawer, a habit she has kept for many years.", "handkerchiefs/handkerchieves", "handkerchiefs/handkerchieves为handkerchief的复数形式,可以变f为v加es或直接加s,表示\"手帕\"。", "名词复数", "handkerchief"),
]

# 第八批次：谓语（20题）
batch8 = [
    ("There ____ a new library and three teaching buildings in our school since 2023.", "has been", "has been为there be句型的现在完成时形式,表示\"有\"。", "谓语", "be"),
    ("My deskmate ____ his homework before he watched the basketball match last night.", "had finished", "had finished为过去完成时,表示\"完成\"这一动作发生在\"看比赛\"之前。", "谓语", "finish"),
    ("____ quiet in the reading room, for everyone is busy reading and studying.", "Keep", "Keep为祈使句的谓语动词,表示\"保持安静\"。", "谓语", None),
    ("The number of students who ____ to school by bike is increasing because of the green travel call.", "go", "go为一般现在时,在定语从句中作谓语,表示\"去\"。", "谓语", "go"),
    ("My parents ____ in the same hospital for over 20 years and they both love their jobs deeply.", "have worked", "have worked为现在完成时,表示\"工作\"这一动作从过去持续到现在。", "谓语", "work"),
    ("Look! It ____ heavily outside, so we have to cancel the outdoor sports meeting.", "is raining", "is raining为现在进行时,表示\"正在下雨\"。", "谓语", "rain"),
    ("You ____ hand in your exercise books before class, or the teacher will not check them.", "must/should", "must/should为情态动词,表示\"必须/应该\"。", "谓语", None),
    ("The students and teachers ____ more than 500 trees on the hill near the school last spring.", "planted", "planted为一般过去时,表示\"种植\"这一动作发生在过去。", "谓语", "plant"),
    ("As we all ____, traditional Chinese culture is one of the most precious treasures of our country.", "know", "know为一般现在时,表示\"知道\"。", "谓语", "know"),
    ("Students ____ to use mobile phones in class according to the school rules.", "are not allowed", "are not allowed为被动语态,表示\"不被允许\"。", "谓语", "not allow"),
    ("Either my brother or I ____ to pick you up at the bus station this afternoon.", "will come", "will come为一般将来时,表示\"将要来\"。", "谓语", "come"),
    ("We ____ English for six years since we entered primary school and we can speak it fluently now.", "have learned/have been learning", "have learned/have been learning为现在完成时/现在完成进行时,表示\"学习\"这一动作从过去持续到现在。", "谓语", "learn"),
    ("If I ____ you, I would take part in the English speech contest to challenge myself.", "were", "were为虚拟语气,表示\"如果我是你\"。", "谓语", "be"),
    ("Our school ____ a sports meeting every autumn and all students take an active part in it.", "holds", "holds为一般现在时,表示\"举行\"。", "谓语", "hold"),
    ("Not only my classmates but also my teacher ____ me with my math problems when I am in trouble.", "helps", "helps为一般现在时,在\"not only...but also...\"结构中,谓语动词与最近的主语一致。", "谓语", "help"),
    ("The plane ____ in ten minutes, so we need to hurry to the boarding gate right now.", "will arrive/is arriving", "will arrive/is arriving为一般将来时/现在进行时表将来,表示\"将要到达\"。", "谓语", "arrive"),
    ("She ____ to bring her English textbook to class this morning, so she had to borrow one from her deskmate.", "forgot", "forgot为一般过去时,表示\"忘记\"这一动作发生在过去。", "谓语", "forget"),
    ("We ____ the environment around us, for it's our duty to make the earth a better place.", "must/should protect", "must/should protect为情态动词+动词原形,表示\"必须/应该保护\"。", "谓语", "protect"),
    ("My grandfather ____ a newspaper every morning after breakfast and it's his daily habit.", "reads", "reads为一般现在时,表示\"读\"这一经常性的动作。", "谓语", "read"),
    ("Our class ____ the first prize in the school singing competition last week and we all felt very excited.", "won", "won为一般过去时,表示\"赢得\"这一动作发生在过去。", "谓语", "win"),
]

# 第九批次：语态（被动+八大时态）（20题）
batch9 = [
    ("The school art festival ____ in our school every May and it's welcomed by all students.", "is held", "is held为一般现在时被动语态,表示\"被举行\"。", "被动语态", "hold"),
    ("A new playground ____ in our school last summer vacation and we can play sports there now.", "was built", "was built为一般过去时被动语态,表示\"被建造\"。", "被动语态", "build"),
    ("The new documentary about Chinese culture ____ in the cinema next week, and I plan to watch it with my family.", "will be shown", "will be shown为一般将来时被动语态,表示\"将被放映\"。", "被动语态", "show"),
    ("The classroom ____ by the students at the moment, so we have to wait outside for a while.", "is being cleaned", "is being cleaned为现在进行时被动语态,表示\"正在被打扫\"。", "被动语态", "clean"),
    ("The problem of students' eye protection ____ by our teachers when I passed the office yesterday afternoon.", "was being discussed", "was being discussed为过去进行时被动语态,表示\"正在被讨论\"。", "被动语态", "discuss"),
    ("The rare wild animal ____ in the forest near our city several times since last year.", "has been seen", "has been seen为现在完成时被动语态,表示\"被看见\"。", "被动语态", "see"),
    ("The whole work ____ by the time the teacher came to check our progress last Friday.", "had been finished", "had been finished为过去完成时被动语态,表示\"被完成\"。", "被动语态", "finish"),
    ("English ____ in almost all middle schools in China and it's an important subject.", "is taught", "is taught为一般现在时被动语态,表示\"被教授\"。", "被动语态", "teach"),
    ("Many famous teachers ____ to give lectures in our school during the education week last month.", "were invited", "were invited为一般过去时被动语态,表示\"被邀请\"。", "被动语态", "invite"),
    ("The broken computer in the classroom ____ by the worker in two hours, so we can use it in the computer class this afternoon.", "will be repaired", "will be repaired为一般将来时被动语态,表示\"将被修理\"。", "被动语态", "repair"),
    ("The ancient buildings in this city ____ by the local government for many years and they look as good as new.", "have been protected", "have been protected为现在完成时被动语态,表示\"被保护\"。主语buildings为复数,所以用have。", "被动语态", "protect"),
    ("All the students ____ to take part in the volunteer activity of cleaning the park this weekend.", "are asked", "are asked为一般现在时被动语态,表示\"被要求\"。", "被动语态", "ask"),
    ("This kind of paper ____ from bamboo and it's very environmentally friendly.", "is made", "is made为一般现在时被动语态,表示\"被制造\"。", "被动语态", "make"),
    ("The students' eyes ____ by the doctor carefully in the physical examination last week.", "were examined", "were examined为一般过去时被动语态,表示\"被检查\"。", "被动语态", "examine"),
    ("The letters to the pen friends ____ already ____ and we are waiting for their replies.", "have been sent", "have been sent为现在完成时被动语态,表示\"已经被寄出\"。第一个空填have,第二个空填been sent。", "被动语态", "send"),
    ("The park ____ because of the bad weather yesterday, so we didn't go there for a walk.", "was closed", "was closed为一般过去时被动语态,表示\"被关闭\"。", "被动语态", "close"),
    ("The books in the library ____ out if you show your student card to the librarian.", "can be taken", "can be taken为情态动词+被动语态,表示\"可以被借出\"。", "被动语态", "take"),
    ("The accident on the road ____ to the police by a driver when it happened yesterday morning.", "was reported", "was reported为一般过去时被动语态,表示\"被报告\"。", "被动语态", "report"),
    ("Many Chinese classic works ____ into different foreign languages and spread all over the world so far.", "have been translated", "have been translated为现在完成时被动语态,表示\"被翻译\"。", "被动语态", "translate"),
    ("The homework ____ by the students before they go to bed every night, which is a good study habit.", "is done", "is done为一般现在时被动语态,表示\"被完成\"。", "被动语态", "do"),
]

# 第十批次：副词综合（20题）
batch10 = [
    ("You should listen ____ to the teacher in class to catch all the key points of the lesson.", "carefully", "carefully为副词,由形容词careful加-ly构成,修饰动词listen,表示\"仔细地\"。", "副词", "careful"),
    ("____ he will come to our class party this weekend is still a question, for he has a lot of homework to do.", "Whether", "Whether为连接副词,引导主语从句,表示\"是否\"。", "副词", None),
    ("The students finished the group task ____ and won praise from the teacher for their efficiency.", "quickly", "quickly为副词,由形容词quick加-ly构成,修饰动词finished,表示\"快速地\"。", "副词", "quick"),
    ("Among all the students in our class, Li Ming speaks English the ____, so he is chosen to take part in the speech contest.", "best", "best为副词well的最高级形式,修饰动词speaks,表示\"最好地\"。", "副词", "well"),
    ("____ you go, you should remember that honesty is the most important quality for a person.", "Wherever", "Wherever为连接副词,引导让步状语从句,表示\"无论哪里\"。", "副词", None),
    ("The children talked and laughed ____ when they went for a picnic in the park last Sunday.", "happily", "happily为副词,由形容词happy变y为i加-ly构成,修饰动词talked和laughed,表示\"快乐地\"。", "副词", "happy"),
    ("She ____ goes out at night alone, because her parents always tell her it's not safe.", "never/hardly", "never/hardly为否定副词,修饰动词goes,表示\"从不/几乎不\"。", "副词", None),
    ("The old man walked ____ along the street, enjoying the beautiful scenery on both sides.", "slowly", "slowly为副词,由形容词slow加-ly构成,修饰动词walked,表示\"慢慢地\"。", "副词", "slow"),
    ("____ we solve the problem is what we need to discuss at the class meeting right now.", "How", "How为连接副词,引导主语从句,表示\"如何\"。", "副词", None),
    ("The teacher explained the difficult grammar point ____ so that all the students could understand it easily.", "clearly", "clearly为副词,由形容词clear加-ly构成,修饰动词explained,表示\"清楚地\"。", "副词", "clear"),
    ("The more you practice speaking English, the ____ you will express yourself in it.", "more fluently", "more fluently为副词比较级,修饰动词express,表示\"更流利地\"。", "副词", "fluent"),
    ("I haven't heard from my pen friend ____, so I'm a little worried about him.", "recently", "recently为副词,由形容词recent加-ly构成,修饰整个句子,表示\"最近\"。", "副词", "recent"),
    ("He studied very hard, but ____ he still failed the math exam because of careless mistakes.", "unfortunately", "unfortunately为转折/评注副词,修饰整个句子,表示\"不幸的是\"。", "副词", None),
    ("Everyone should speak ____ to the elderly and show our respect for them.", "politely", "politely为副词,由形容词polite去e加-ly构成,修饰动词speak,表示\"礼貌地\"。", "副词", "polite"),
    ("To our surprise, the little boy ____ remembered all the English words he had learned in a week.", "truly", "truly为副词,由形容词true去e加-ly构成,修饰动词remembered,表示\"真正地\"。", "副词", "true"),
    ("____ you finish your homework, you can watch your favorite cartoon for half an hour.", "Once", "Once为连接副词,引导时间状语从句,表示\"一旦\"。", "副词", None),
    ("The athlete trains ____ every day to realize his dream of winning a prize in the competition.", "hard", "hard为副词,修饰动词trains,表示\"努力地\"。注意hard既是形容词也是副词,不需要加-ly。", "副词", "hard"),
    ("The street is ____ quiet in the early morning, with only a few people walking around.", "usually", "usually为副词,由形容词usual加-ly构成,修饰形容词quiet,表示\"通常\"。", "副词", "usual"),
    ("She is very busy with her study, so she ____ has time to watch TV or play computer games.", "seldom/hardly", "seldom/hardly为否定副词,修饰动词has,表示\"很少/几乎不\"。", "副词", None),
    ("If you want to learn a language well, you need to practice it ____ than just memorizing words.", "better", "better为副词well的比较级形式,修饰动词practice,表示\"更好地\"。", "副词", "good"),
]

# Category映射表：将grammarPoint映射到标准的category值
CATEGORY_MAPPING = {
    "人称代词": "代词",
    "连词与名/动/形/副综合": "连词",
    "复合词与外来词": "名词",
    "单复数同形": "名词",
    "不规则复数": "名词",
    "以o结尾": "名词",
    "以y结尾": "名词",
    "以s/sh/ch/x结尾": "名词",
    "以f/fe结尾": "名词",
    "谓语": "谓语",
    "语态（被动+八大时态）": "谓语",
    "副词综合": "副词",
}

# 合并所有批次
all_batches = [
    ("人称代词", batch1),
    ("连词与名/动/形/副综合", batch2),
    ("复合词与外来词", batch3),
    ("单复数同形", batch4),
    ("不规则复数", batch5),
    ("以o/y/s/sh/ch/x结尾", batch6),  # 特殊处理，需要根据题目标注细分
    ("以f/fe结尾", batch7),
    ("谓语", batch8),
    ("语态（被动+八大时态）", batch9),
    ("副词综合", batch10),
]

# 生成所有习题
for batch_name, batch in all_batches:
    for text, answer, analysis, grammar_point, hint in batch:
        # 对于第六批次，根据题目中的标注来确定grammarPoint
        if batch_name == "以o/y/s/sh/ch/x结尾":
            if "（以o结尾）" in text:
                grammar_point = "以o结尾"
            elif "（以y结尾）" in text:
                grammar_point = "以y结尾"
            elif "（s/sh/ch/x结尾）" in text:
                grammar_point = "以s/sh/ch/x结尾"
            else:
                grammar_point = batch_name  # 默认值
        else:
            grammar_point = batch_name
        
        # 根据grammarPoint获取对应的category
        category = CATEGORY_MAPPING.get(grammar_point, grammar_point)
        
        exercise = create_exercise(text, answer, analysis, grammar_point, hint, category)
        exercises.append(exercise)

# 保存为JSON文件
output_file = "新习题数据.json"
with open(output_file, 'w', encoding='utf-8') as f:
    for exercise in exercises:
        f.write(json.dumps(exercise, ensure_ascii=False) + '\n')

print(f"已生成 {len(exercises)} 道习题，保存到 {output_file}")
