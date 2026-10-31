const characterInfo={
  悟空:{id:'wukong',name:'孙悟空',role:'齐天大圣',seal:'悟',emotion:'fierce'},
  玄奘:{id:'tang',name:'唐玄奘',role:'金蝉长老',seal:'玄',emotion:'warm'},
  八戒:{id:'bajie',name:'猪八戒',role:'天蓬元帅',seal:'戒',emotion:'cheerful'},
  悟净:{id:'sha',name:'沙悟净',role:'卷帘大将',seal:'净',emotion:'steady'},
  妖:{id:'antagonist',name:'黑熊精',role:'黑风山妖王',seal:'妖',emotion:'fierce'}
};

const chapterData=[
  {mark:'第一卷',name:'五行山',place:'五行山 · 山门',background:'assets/backgrounds/wuxing-stage.png',trials:[
    ['长安发愿','唐王御前，玄奘接过通关文牒。殿外暮鼓未歇，他已把众生的名字一一记在经卷边缘。','玄奘'],
    ['五行山揭帖','山风从石缝里钻出来，压了五百年的悟空抬起眼，问你：这一趟西天，当真不是新的枷锁？','悟空'],
    ['鹰愁涧失马','白雾压住涧口，龙吟在水底翻滚。失去坐骑的玄奘没有责备任何人，只把缰绳放在石上。','玄奘'],
    ['观音院夜火','老院主的眼睛映着袈裟，也映着火。悟空握紧金箍棒，火场里传来求救的声音。','悟空'],
    ['黑风山寻袈裟','黑风大王把锦襕袈裟挂在洞中最高处，洞外群妖列阵，像一片没有月亮的林。','悟空'],
    ['黄风岭借风','黄风怪卷起漫天沙尘，八戒的钉耙在风里失了准头。悟空却闻见一丝灵山的香火气。','八戒'],
    ['流沙河问渡','河面没有舟，只有九颗骷髅在浪尖起伏。悟净站在对岸，像等了许多个轮回。','悟净'],
    ['收卷帘大将','悟净摘下颈上骷髅，低声说：我愿背行李，却怕自己还会拖累人。玄奘把经卷递给他。','玄奘'],
    ['四圣试禅心','庄院灯火温软，四位夫人问师徒是否愿意留下。窗外的取经路在雨中静静等候。','八戒']
  ]},
  {mark:'第二卷',name:'五庄观',place:'万寿山 · 五庄观',background:'assets/backgrounds/gaolao-stage.png',trials:[
    ['人参果落地','果子坠入土里无影无踪，清风明月的哭声比骂声更重。悟空看着空落的供桌没有辩解。','悟空'],
    ['推倒人参树','一棍落下，枝叶如星雨坠地。玄奘闭上眼，第一次对悟空说：快并不总是答案。','玄奘'],
    ['三岛求方','云海无岸，悟空独自去求活树的法门。八戒嘴上抱怨，已把行李重新打好。','八戒'],
    ['白骨初现','荒村炊烟里，一个送饭的女子走来。悟空的火眼看见了白骨，玄奘只看见她颤抖的手。','悟空'],
    ['逐走悟空','紧箍咒停下来时，悟空已经走远。山路忽然很宽，宽得只剩玄奘一个人的影子。','玄奘'],
    ['宝象国月夜','黄袍怪把百花羞困在冷宫。她说自己记得前世，却不记得该不该原谅今生。','八戒'],
    ['莲花洞借名','金角银角举着紫金葫芦，问谁敢答应。悟空笑着摸了摸耳后毫毛。','悟空'],
    ['乌鸡国还魂','井水映出国王三年的冤屈。悟净守在井边，等一个人重新相信人间。','悟净'],
    ['红孩儿假哭','孩童被缚在松树上，哭声撕心裂肺。八戒已经举耙上前，悟空却拦住了他。','八戒']
  ]},
  {mark:'第三卷',name:'火云洞',place:'火云洞 · 赤霞',background:'assets/backgrounds/fire-stage.png',trials:[
    ['三昧真火','火焰像三条蛇缠住山谷，悟空翻出火海时，金甲上只剩一片暗红。','悟空'],
    ['观音收红孩儿','红孩儿跪在莲台前仍不服输。玄奘看着孩子的背影，想起每个执念都曾是求救。','玄奘'],
    ['车迟国赌斗','虎力、鹿力、羊力三道长摆出法坛。百姓站在雨里，不敢看任何一方输。','悟净'],
    ['通天河童祭','冰河旁排着两行孩子，村民说这是祖辈的规矩。八戒把孩子护在身后，钉耙垂在雪里。','八戒'],
    ['金兜洞失宝','金刚琢收走了金箍棒，也收走了悟空的笑。山风吹过空手的齐天大圣。','悟空'],
    ['西梁女国','女王的茶里有一片花瓣。玄奘没有饮，却把那句未出口的告别听得很清楚。','玄奘'],
    ['琵琶洞琴音','蝎子精的琴音落在石壁上，像人心里最难承认的一句留恋。','八戒'],
    ['真假行者','两根金箍棒撞开云海。每个人都说自己是真的，连玄奘也分不清该叫谁回来。','悟空'],
    ['如来辨心','莲台上，真假悟空站在同一束光里。如来说，最难辨的不是身形，是不愿被看见的念头。','悟空']
  ]},
  {mark:'第四卷',name:'女儿国',place:'西梁女国 · 春庭',background:'assets/backgrounds/daughter-stage.png',trials:[
    ['子母河水','一碗河水误入腹中，师徒的窘迫在花树下无处可藏。八戒先笑，又悄悄把药包塞给玄奘。','八戒'],
    ['女王求亲','女王让所有人退下，只问玄奘一句：若不为经卷，你可曾想过留在这里？','玄奘'],
    ['蝎子精毒刺','毒钩刺进悟空肩头，悟空反倒笑了，说这世上最痛的从不是皮肉。','悟空'],
    ['火焰山远望','山脊像被烧红的铁。白龙马低头不前，玄奘下马摸了摸它的鬃毛。','玄奘'],
    ['芭蕉扇初借','铁扇公主把门关得很响。她说旧怨不是一把扇子能吹散的。','悟空'],
    ['牛魔王旧友','牛魔王摆下酒坛，认出悟空时先是大笑，随后笑声一点点沉进夜色。','悟空'],
    ['真假芭蕉扇','一扇扇出烈火，一扇扇出寒风。悟净在风眼里守住经卷，不让它飞向任何一边。','悟净'],
    ['火焰山熄火','风穿过火焰山，山下的农田终于露出颜色。八戒蹲下摸土，像摸到久别的家。','八戒'],
    ['祭赛国佛宝','金光寺的舍利被盗，僧人以为是天罚。玄奘点起一盏灯，让他们先看清彼此的脸。','玄奘']
  ]},
  {mark:'第五卷',name:'盘丝洞',place:'盘丝洞 · 月白',background:'assets/backgrounds/pansi-stage.png',trials:[
    ['盘丝初网','银丝从石顶垂下，七个笑声沿着网滑过来。悟空把棒尖抵在地上，没有先动。','悟空'],
    ['濯垢泉月影','泉水里没有妖影，只有每个人想忘掉的往事。八戒看得最久，最后自己先别开脸。','八戒'],
    ['黄花观毒茶','茶盏边缘泛着金色。玄奘举杯前，悟净伸手挡住，手背被毒雾灼出一片红。','悟净'],
    ['狮驼岭阴云','三座山头像三张巨口。悟空第一次没有嘲笑八戒的害怕。','悟空'],
    ['狮驼国空城','城中没有哭声，只有被收好的万家灯火。玄奘走过一扇扇门，念了一夜往生咒。','玄奘'],
    ['大鹏展翅','金翅大鹏遮住了整片天空。悟空仰头时，连金箍棒都显得像一根针。','悟空'],
    ['比丘国童心','国师索要一千一百一十一个孩子。八戒把孩子抱在怀里，怎么也放不下。','八戒'],
    ['白鹿现形','寿星的白鹿低下头，露出妖相。悟净问：被宠爱的人，是否也该为伤人负责？','悟净'],
    ['无底洞寻灯','洞穴一层深过一层，灯芯却始终亮着。玄奘说，迷路时先别把灯吹灭。','玄奘']
  ]},
  {mark:'第六卷',name:'小雷音',place:'小雷音寺 · 金钟',background:'assets/backgrounds/leiyin-stage.png',trials:[
    ['小雷音假佛','钟声庄严，佛像垂目。悟空却看见香灰落得太快，像有人在急着掩盖脚印。','悟空'],
    ['黄眉人种袋','师徒被收进布袋，黑暗里听不见自己的脚步。八戒先开口讲笑话，怕大家忘了彼此还在。','八戒'],
    ['弥勒瓜田','弥勒佛笑着拍了拍瓜皮，说世间有些困局，越用力越紧。','玄奘'],
    ['七绝山稻香','稻田被蟒蛇盘成了迷宫。悟净把行李举过头顶，踩着泥水领众人向前。','悟净'],
    ['朱紫国心病','国王的病在心，不在身。玄奘让所有人退下，只留下他和一盏不会问话的灯。','玄奘'],
    ['赛太岁铃声','紫金铃一响，满殿的火焰都听令。悟空变作小妖，笑得像从未害怕过。','悟空'],
    ['麒麟山婚约','金圣宫娘娘抱着旧衣问：等待是否也是一种选择？八戒没有立刻回答。','八戒'],
    ['盘桓山木仙','松、柏、竹、梅谈诗论道，却不肯放过赶路的人。悟空说，风雅若拦路，便也是妖。','悟空'],
    ['荆棘岭夜谈','玄奘在荆棘中读了一夜经。天亮时，所有棘刺都朝着西方让出一条细路。','玄奘']
  ]},
  {mark:'第七卷',name:'通天河',place:'通天河 · 雪霁',background:'assets/backgrounds/tongtian-stage.png',trials:[
    ['通天河冰裂','冰面裂开时，水下的鱼群像星河倒流。悟净先把经卷放到最高处。','悟净'],
    ['灵感大王','金鱼精在河神庙前设宴，村民们端着供盘，谁也不敢抬头。','玄奘'],
    ['陈家庄还愿','陈家夫妇抱回孩子时，八戒站在门外很久，没让任何人看见他红了眼。','八戒'],
    ['独角兕回首','青牛精说，太上老君留下它看守人心。悟空问它：看守久了，可还记得自由？','悟空'],
    ['女儿国再会','风从西梁吹来，带来一片干枯花瓣。玄奘把花夹回经卷，不让别人看见。','玄奘'],
    ['灭法国改名','国王下令杀尽僧人。悟净站在城墙下，只问他有没有听过每个名字。','悟净'],
    ['隐雾山救婴','豹头山的雾里传来婴儿哭声。八戒扛起钉耙，却放轻了脚步。','八戒'],
    ['凤仙郡祈雨','天庭的米山、面山和锁链横在云间。悟空第一次耐着性子劝人改过。','悟空'],
    ['玉华城传艺','三位王子拜悟空为师，练棒时把手磨出血。悟空把药扔过去，转身又说别偷懒。','悟空']
  ]},
  {mark:'第八卷',name:'天竺路',place:'天竺国 · 灯市',background:'assets/backgrounds/daughter-stage.png',trials:[
    ['竹节山妖车','九灵元圣一声吼，山林都静了。悟空听见自己的心跳，也听见师父的念经声。','悟空'],
    ['豹头山迷雾','雾中每一棵树都像旧友。悟净在树干上刻下小小的记号，避免大家走散。','悟净'],
    ['金平府灯会','三盏佛灯被妖怪偷走，百姓还在欢庆。玄奘决定先守住这一夜的灯火。','玄奘'],
    ['玄英洞犀牛','三只犀牛举角冲来，八戒迎上去时没有回头，只说后面的路交给你们。','八戒'],
    ['青龙山犀角','犀角里藏着一段被偷走的祈愿。悟空把它放回灯中，让它自己飞向人群。','悟空'],
    ['天竺假公主','假公主盖头落下，玉兔精露出真身。玄奘没有怒，只问她为何不敢回月宫。','玄奘'],
    ['玉兔归月','月光照在天竺城墙上，八戒仰头看了很久，终于把那句想嫦娥的话咽了回去。','八戒'],
    ['寇员外好客','寇员外把最好的房间留给师徒，却不知善意也会被人当作罪证。','悟净'],
    ['铜台府冤狱','玄奘被锁在狱中，悟空本可破门，却先去找出了真正的盗贼。','悟空']
  ]},
  {mark:'第九卷',name:'灵山',place:'灵山 · 云门',background:'assets/backgrounds/lingshan-stage.png',trials:[
    ['凌云渡独木桥','桥下是旧我，桥上是未知。玄奘迈步时没有回头，悟空却替他看了一眼来路。','玄奘'],
    ['无底船去壳','船到彼岸，旧身留在水里。八戒摸摸自己的肚子，笑说原来还在。','八戒'],
    ['阿傩索人事','经书就在眼前，却有人要先收一份人事。悟空的手按在棒上，玄奘示意他放开。','悟空'],
    ['白纸无字经','无字经卷落在掌心，众人以为受了戏弄。玄奘却说，空白也许是在问我们写什么。','玄奘'],
    ['通天河湿经','回程的河水浸湿经卷，字迹晕开。悟净一页页摊在石上，像摊开一路的风雨。','悟净'],
    ['再登灵山','这一次没有人催促。悟空站在山门外，竟先替八戒理了理衣领。','悟空'],
    ['封赏之前','佛光落下，四人都听见自己的名字。八戒小声问：以后还能一起吃饭吗？','八戒'],
    ['真经落卷','八十一难的最后一页没有写结果，只有四道并肩的影子，往长安方向缓缓拉长。','悟净'],
    ['西行之后','灵山门低得必须俯身才能进。玄奘回首，取经路仍在云下，像从未结束。','玄奘']
  ]}
];

const actionSets=[
  ['以金刚手段直面险境','先护住眼前受难的人','循着蛛丝马迹找出真相'],
  ['以愿心继续赶路','把误会说开再作决定','留下一条能回头的路'],
  ['把险处揽到自己身上','请同伴一起商议','观察对方真正想要什么']
];
const sceneScripts={
  '0:0':[
    {kind:'旁白',speaker:null,text:'长安发愿。暮鼓落下最后一声，玄奘接过通关文牒，指腹压住纸上微微翘起的边角。'},
    {kind:'对白',speaker:'玄奘',text:'“陛下，贫僧此去，不求风平浪静，只求每一处受苦的人，都有人肯听见。”'},
    {kind:'对白',speaker:'悟空',text:'“听见？西天路上听不见的声音多了。你可别走到半路，才发现经卷没有耳朵。”'},
    {kind:'对白',speaker:'玄奘',text:'“那就由我们替它听。”他抬眼看向城门外的黑夜，“悟空，第一步你愿意与我同走吗？”'},
    {kind:'旁白',speaker:null,text:'城门缓缓打开。马蹄声穿过晨雾，四周还没有同伴，只有一条尚未写完的路。'}
  ],
  '0:1':[
    {kind:'旁白',speaker:null,text:'五行山揭帖。石缝里先亮起一双金色的眼睛，随后才传来一声被岩层压低的笑。'},
    {kind:'对白',speaker:'悟空',text:'“五百年了。和尚，你是来放我，还是来给我换一副更好看的枷锁？”'},
    {kind:'对白',speaker:'玄奘',text:'“我来请你同行。枷锁若在心里，谁也替不了你取下。”'},
    {kind:'对白',speaker:'悟空',text:'“说得轻巧。若我再闯一次天门，你也会念那道紧箍咒吗？”'},
    {kind:'旁白',speaker:null,text:'玄奘没有回答，只把手伸进石缝。山风忽然停了，像在等一只被困太久的手。'}
  ],
  '0:2':[
    {kind:'旁白',speaker:null,text:'鹰愁涧失马。白雾从涧底翻上来，玄奘的白马只来得及留下半截缰绳。'},
    {kind:'对白',speaker:'玄奘',text:'“它不是逃走。水下那声龙吟，是它替我们挡了一劫。”'},
    {kind:'对白',speaker:'悟空',text:'“师父，龙也好，妖也好，敢从俺老孙手里抢东西，总要露个面。”'},
    {kind:'对白',speaker:'玄奘',text:'“先把缰绳收好。它若回来，要知道我们没有把它留在原地。”'},
    {kind:'旁白',speaker:null,text:'悟空收起金箍棒，雾里露出一线湿亮的鳞光。西行的第一匹白马，正在水下重新学会呼吸。'}
  ],
  '0:3':[
    {kind:'旁白',speaker:null,text:'观音院夜火。老院主伸手去够锦襕袈裟，火舌先一步舔上了窗棂。'},
    {kind:'对白',speaker:'悟空',text:'“一件袈裟也能烧出这么大的火？不，是有人把贪心添成了柴。”'},
    {kind:'对白',speaker:'玄奘',text:'“先救人。失物可以再寻，活着的人不能等火讲完道理。”'},
    {kind:'对白',speaker:'悟空',text:'“好。那我便把这场火的主人，连同他的账，一起找回来。”'},
    {kind:'旁白',speaker:null,text:'棍影劈开屋梁，和尚们从火光里跌跌撞撞跑出。远山深处，一只黑熊正披着红色袈裟回望。'}
  ],
  '0:4':[
    {kind:'旁白',speaker:null,text:'黑风山寻袈裟。洞门像一张合拢的嘴，洞内的灯火把袈裟照成一片不属于人间的红。'},
    {kind:'对白',speaker:'妖',text:'“齐天大圣，五百年不见，你还是只会先亮兵器。”'},
    {kind:'对白',speaker:'悟空',text:'“你偷的是袈裟，不是我的耐心。把它放下，我让你自己走出黑风。”'},
    {kind:'对白',speaker:'妖',text:'“若我说，穿上它之后，我第一次觉得自己像个被佛光看见的人呢？”'},
    {kind:'旁白',speaker:null,text:'悟空的棍尖停在半空。洞外风声骤紧，真正要被夺回的，也许不只是那件袈裟。'}
  ],
  '0:5':[
    {kind:'旁白',speaker:null,text:'黄风岭借风。沙尘把天地折成一张黄纸，八戒的钉耙在纸上留下三道深痕。'},
    {kind:'对白',speaker:'八戒',text:'“这风不讲理，吹得俺老猪连肚皮都找不着了。”'},
    {kind:'对白',speaker:'悟空',text:'“风里有腥气。八戒，别追着风跑，盯住它不敢吹过来的地方。”'},
    {kind:'对白',speaker:'八戒',text:'“你说得容易。那地方要是刚好是妖怪的嘴呢？”'},
    {kind:'旁白',speaker:null,text:'沙幕短暂裂开，露出一座没有门的洞府。黄风深处，隐约有人在念一段求救的经。'}
  ],
  '0:6':[
    {kind:'旁白',speaker:null,text:'流沙河问渡。九颗骷髅随浪起伏，像九个不肯被记住的名字。'},
    {kind:'对白',speaker:'悟净',text:'“我在这里等了很久。每一个要过河的人，都只问我能不能赢。”'},
    {kind:'对白',speaker:'玄奘',text:'“那我问你，若同行不是为了赢，你愿意把船让给我们吗？”'},
    {kind:'对白',speaker:'悟净',text:'“愿意。但我得先知道，你们会不会把我也算作同行。”'},
    {kind:'旁白',speaker:null,text:'水声缓下来。悟净放下月牙铲，第一次从河底走向岸边，而不是把人拖进水里。'}
  ],
  '0:7':[
    {kind:'旁白',speaker:null,text:'收卷帘大将。悟净把行李一件件系好，动作很稳，只有最后一根绳结打了两次。'},
    {kind:'对白',speaker:'玄奘',text:'“你怕的不是拖累，是再次失去可以回去的地方。”'},
    {kind:'对白',speaker:'悟净',text:'“我曾摔碎过琉璃盏，也曾看着九世人沉入水里。背得动行李，不代表背得动这些。”'},
    {kind:'对白',speaker:'玄奘',text:'“那便一人一程。今日我替你记住，明日你替我们守住。”'},
    {kind:'旁白',speaker:null,text:'四个人的影子第一次在同一块石头上重叠。它们并不齐整，却开始像一支队伍。'}
  ],
  '0:8':[
    {kind:'旁白',speaker:null,text:'四圣试禅心。庄院的灯火暖得近乎不真实，门内的饭香让八戒的脚步慢了下来。'},
    {kind:'对白',speaker:'八戒',text:'“要不，咱们就住一晚？只一晚，俺老猪保证明早第一个起。”'},
    {kind:'对白',speaker:'悟空',text:'“你每次说保证，耳朵就先耷拉下来。”'},
    {kind:'对白',speaker:'八戒',text:'“那你呢？你就没有想过，哪怕一盏灯也好？”'},
    {kind:'旁白',speaker:null,text:'玄奘在门外合十。雨声把庄院的笑声一层层洗薄，西方的月亮重新露出来。'}
  ]
};
const defaultCharacterArt={wukong:'assets/characters/wukong.png',tang:'assets/characters/tang.png',bajie:'assets/characters/bajie.png',sha:'assets/characters/sha.png',antagonist:'assets/characters/black-bear.png'};
const characterStateArt={
  '0:0':{tang:'assets/characters/tang-vow.png'},
  '0:1':{wukong:'assets/characters/wukong-imprisoned.png'},
  '0:2':{wukong:'assets/characters/wukong-released.png'},
  '0:4':{antagonist:'assets/characters/black-bear.png'}
};
const sceneBackgrounds={'0:0':'assets/backgrounds/changan-departure.png'};
const sceneMetaOverrides={'0:0':{name:'长安',place:'长安 · 大明宫'}};
const characterKeyById=Object.fromEntries(Object.entries(characterInfo).map(([key,info])=>[info.id,key]));
const characterStageOrder=['悟空','玄奘','八戒','悟净','妖'];
const faceAnchors={
  悟空:{x:.54,y:.17,w:.18,h:.13},
  玄奘:{x:.58,y:.18,w:.18,h:.12},
  八戒:{x:.5,y:.18,w:.2,h:.14},
  悟净:{x:.52,y:.17,w:.18,h:.13},
  妖:{x:.53,y:.16,w:.21,h:.14}
};

// Pair-specific visual direction keeps the same silhouette readable as a relationship, not just a speaker.
const relationshipVisuals={
  '悟空|玄奘':{
    悟空:{emotion:'wary',pose:'guard',motion:'hold',expression:'doubt',shift:1.2,tilt:.5},
    玄奘:{emotion:'patient',pose:'reassure',motion:'settle',expression:'soft',shift:1,tilt:.35}
  },
  '悟空|八戒':{
    悟空:{emotion:'playful',pose:'challenge',motion:'tease',expression:'smirk',shift:1.1,tilt:.8},
    八戒:{emotion:'comic',pose:'brace',motion:'fidget',expression:'flustered',shift:1,tilt:-.8}
  },
  '悟空|悟净':{
    悟空:{emotion:'focused',pose:'advance',motion:'scan',expression:'alert',shift:1.15,tilt:.35},
    悟净:{emotion:'supportive',pose:'anchor',motion:'anchor',expression:'steady',shift:.8,tilt:-.2}
  },
  '悟空|妖':{
    悟空:{emotion:'defiant',pose:'challenge',motion:'strike',expression:'grit',shift:1.5,tilt:1.1},
    妖:{emotion:'menace',pose:'threat',motion:'loom',expression:'threat',shift:1.2,tilt:-.8}
  },
  '玄奘|八戒':{
    玄奘:{emotion:'compassionate',pose:'counsel',motion:'reassure',expression:'tender',shift:1,tilt:.25},
    八戒:{emotion:'rueful',pose:'yield',motion:'fidget',expression:'guilty',shift:.9,tilt:-.7}
  },
  '玄奘|悟净':{
    玄奘:{emotion:'warm',pose:'bless',motion:'settle',expression:'calm',shift:1,tilt:.2},
    悟净:{emotion:'attentive',pose:'listen',motion:'listen',expression:'watchful',shift:.8,tilt:-.25}
  },
  '玄奘|妖':{
    玄奘:{emotion:'solemn',pose:'protect',motion:'hold',expression:'mercy',shift:1.15,tilt:.15},
    妖:{emotion:'suspicious',pose:'threat',motion:'loom',expression:'watchful',shift:1.2,tilt:-.65}
  },
  '八戒|悟净':{
    八戒:{emotion:'cheerful',pose:'appeal',motion:'bounce',expression:'open',shift:1,tilt:.55},
    悟净:{emotion:'steady',pose:'anchor',motion:'anchor',expression:'patient',shift:.8,tilt:-.2}
  },
  '八戒|妖':{
    八戒:{emotion:'protective',pose:'guard',motion:'brace',expression:'resolve',shift:1.35,tilt:.65},
    妖:{emotion:'menace',pose:'threat',motion:'loom',expression:'threat',shift:1.2,tilt:-.8}
  },
  '悟净|妖':{
    悟净:{emotion:'resolute',pose:'protect',motion:'block',expression:'resolve',shift:1.25,tilt:.35},
    妖:{emotion:'menace',pose:'threat',motion:'loom',expression:'threat',shift:1.2,tilt:-.8}
  }
};
const motionProfiles={
  watch:{travel:0,lift:2,tilt:0,speed:5.8},
  hold:{travel:.25,lift:3,tilt:.15,speed:4.2},
  settle:{travel:.3,lift:2,tilt:.15,speed:4.8},
  challenge:{travel:1.8,lift:4,tilt:1.2,speed:2.9},
  tease:{travel:1.1,lift:3,tilt:1.6,speed:2.5},
  scan:{travel:1.2,lift:3,tilt:.8,speed:3.3},
  strike:{travel:2.4,lift:5,tilt:2.2,speed:2},
  loom:{travel:1.3,lift:2,tilt:.7,speed:3.6},
  reassure:{travel:.8,lift:2,tilt:.25,speed:4},
  fidget:{travel:1,lift:2,tilt:1.8,speed:1.9},
  anchor:{travel:.3,lift:1,tilt:.1,speed:5.5},
  listen:{travel:.5,lift:2,tilt:.45,speed:4.5},
  bounce:{travel:1.1,lift:5,tilt:1,speed:2.4},
  brace:{travel:1.2,lift:4,tilt:1.3,speed:2.8},
  block:{travel:1.6,lift:3,tilt:.6,speed:3}
};
const expressionVisuals={
  neutral:{tilt:0,squint:.95,mouth:'42%',rotate:0,glow:'.5px',color:'#e8d295'},
  doubt:{tilt:-5,squint:.82,mouth:'40%',rotate:-3,glow:'1.4px',color:'#f1c273'},
  soft:{tilt:2,squint:1.12,mouth:'58%',rotate:1,glow:'1px',color:'#efd69c'},
  smirk:{tilt:7,squint:.72,mouth:'38%',rotate:-8,glow:'1.8px',color:'#f0b76d'},
  flustered:{tilt:-4,squint:1.18,mouth:'68%',rotate:4,glow:'1.5px',color:'#e39178'},
  alert:{tilt:-2,squint:.7,mouth:'44%',rotate:-1,glow:'2.2px',color:'#8ac7bc'},
  steady:{tilt:0,squint:.96,mouth:'48%',rotate:0,glow:'1.2px',color:'#8fbfac'},
  grit:{tilt:-8,squint:.63,mouth:'34%',rotate:2,glow:'2.8px',color:'#f08a68'},
  threat:{tilt:-10,squint:.54,mouth:'30%',rotate:-2,glow:'3px',color:'#ec6a56'},
  tender:{tilt:4,squint:1.15,mouth:'64%',rotate:2,glow:'1.1px',color:'#edcf91'},
  guilty:{tilt:-5,squint:.76,mouth:'42%',rotate:3,glow:'.7px',color:'#c69d76'},
  calm:{tilt:1,squint:1.08,mouth:'54%',rotate:1,glow:'.8px',color:'#d5bd83'},
  watchful:{tilt:-4,squint:.68,mouth:'40%',rotate:-1,glow:'2px',color:'#9ebfb0'},
  open:{tilt:2,squint:1.16,mouth:'74%',rotate:0,glow:'1.5px',color:'#e9ad70'},
  patient:{tilt:0,squint:1,mouth:'52%',rotate:0,glow:'1px',color:'#aac5b0'},
  resolve:{tilt:-6,squint:.64,mouth:'34%',rotate:1,glow:'2.4px',color:'#e7ad68'},
  mercy:{tilt:3,squint:1.1,mouth:'60%',rotate:2,glow:'1.2px',color:'#e5c58b'}
};
const narrativeVersion=3;
let restoredNarrativeVersion=narrativeVersion;
let state={chapter:0,trial:0,resolve:0,mercy:0,insight:0,marks:[],sound:true,auto:false,mode:'story',lineIndex:0,pendingChoice:null,narrativeVersion};
try{const savedState=JSON.parse(localStorage.getItem('xixing-stage-save')||'{}');if(savedState&&typeof savedState==='object'){restoredNarrativeVersion=Number(savedState.narrativeVersion)||0;Object.assign(state,savedState)}}catch(error){}
state.chapter=Math.max(0,Math.min(8,Number(state.chapter)||0));state.trial=Math.max(0,Math.min(8,Number(state.trial)||0));state.marks=Array.isArray(state.marks)?state.marks:[];state.mode=['story','choices','response'].includes(state.mode)?state.mode:'story';state.lineIndex=Math.max(0,Number(state.lineIndex)||0);
const needsNarrativeReplay=restoredNarrativeVersion!==narrativeVersion;
if(needsNarrativeReplay){state.mode='story';state.lineIndex=0;state.pendingChoice=null}state.narrativeVersion=narrativeVersion;

const $=selector=>document.querySelector(selector);
const app=$('#app');const backdrop=$('#stageBackdrop');const particles=$('#stageParticles');
const storageKey='xixing-stage-save';let choosing=false;let audioContext;
function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
if(needsNarrativeReplay)save();
function currentChapter(){return chapterData[state.chapter]}
function currentTrial(){return currentChapter().trials[state.trial]}
function currentSceneMeta(){return{...currentChapter(),...(sceneMetaOverrides[`${state.chapter}:${state.trial}`]||{})}}
function trialNumber(){return state.chapter*9+state.trial+1}
function makeParticles(){particles.innerHTML=Array.from({length:24},(_,index)=>`<span style="--left:${(index*37)%97}%;--duration:${5+(index%7)}s;--delay:-${index*.63}s"></span>`).join('')}
function setBackdrop(chapter){const src=sceneBackgrounds[`${state.chapter}:${state.trial}`]||chapter.background;if(backdrop.getAttribute('src')===src)return;app.classList.add('scene-shift');const preloader=new Image();preloader.onload=()=>{backdrop.src=src;backdrop.alt=`${chapter.name}舞台背景`;setTimeout(()=>app.classList.remove('scene-shift'),120)};preloader.src=src}
function updateCharacterAnchors(){document.querySelectorAll('.character').forEach(element=>{const anchor=faceAnchors[element.dataset.character],image=element.querySelector('img'),figureRect=element.getBoundingClientRect();if(!anchor||!image||!image.naturalWidth||!figureRect.width||!figureRect.height)return;const imageRect=image.getBoundingClientRect(),ratio=image.naturalWidth/image.naturalHeight,fitWidth=Math.min(imageRect.width,imageRect.height*ratio),fitHeight=fitWidth/ratio,contentLeft=imageRect.left+(imageRect.width-fitWidth)/2,contentTop=imageRect.bottom-fitHeight,centerX=contentLeft+fitWidth*anchor.x,centerY=contentTop+fitHeight*anchor.y;element.style.setProperty('--face-x',`${((centerX-figureRect.left)/figureRect.width)*100}%`);element.style.setProperty('--face-y',`${((figureRect.bottom-centerY)/figureRect.height)*100}%`);element.style.setProperty('--face-w',`${(fitWidth*anchor.w/figureRect.width)*100}%`);element.style.setProperty('--face-h',`${(fitHeight*anchor.h/figureRect.height)*100}%`)})}
const dialogueDeck=$('.dialogue-inner');const advanceButton=$('#advanceBtn');let autoTimer=null;
const voiceFragments={
  悟空:['俺老孙看得见这风里的鬼祟。','山压得住身子，压不住一双眼。','龙吟也好，妖火也罢，先把师父送过去。','这火若要烧人，先问过我的棒。','俺老孙不怕硬仗，只怕有人把求救藏起来。','风沙遮眼，遮不住一条活路。','这河底的影子，像在等一个肯回头的人。','要走便走，莫把慈悲说成软弱。','若真有两个我，先问问谁还记得他们。'],
  玄奘:['贫僧既接此卷，便不能只为自己求安稳。','我听见山下有人在等，也听见自己心里的迟疑。','马失了可以再寻，愿心失了便难回头。','火光照人时，最先要看清的是自己的手。','若一盏灯能照见众生，便不该只照我一人。','我不求路上没有风，只求同行的人不被风吹散。','留与不留，皆是因果；但愿我们不以沉默伤人。','经卷湿了可以晒干，人的名字不能再丢。','灵山若有答案，也该容得下我们的疑问。'],
  八戒:['俺也去，俺也去，只是这回别又把饭锅丢在半路。','我嘴上怕，脚可没往后退。','先把孩子护住，妖怪的账待会儿再算。','这茶要是有毒，俺也去先替大家尝一口。','旧情旧债最磨人，俺老猪也不是全然不懂。','别看我笑，心里那点舍不得可重着呢。','打架我不一定赢，抱住一个孩子总不会输。','要是还有饭吃，俺也去愿意陪你们再走远些。','封号不封号的，先问问以后还能不能一起吃饭。'],
  悟净:['行李在我肩上，诸位只管看前路。','这河水记得九世的人，我愿替它记住第十世。','先稳住脚，再谈谁对谁错。','我见过被遗忘的名字，所以不愿再丢下一人。','风大时，棍与耙都要收一收，免得伤及无辜。','守住经卷不是为了经卷，是为了它背后的人。','若要渡河，我走最后，确保没有人落下。','每一处记号都在说：我们还在一起。','回头并不可耻，找回同伴才是。']
};
function companionFor(speaker,index){const order={悟空:['玄奘','悟净','八戒'],玄奘:['悟空','悟净','八戒'],八戒:['悟空','玄奘','悟净'],悟净:['玄奘','悟空','八戒'],妖:['悟空','玄奘','悟净']};return (order[speaker]||order.悟空)[index%3]}
function relationshipKey(first,second){return [first,second].sort((left,right)=>characterStageOrder.indexOf(left)-characterStageOrder.indexOf(right)).join('|')}
function baseVisual(characterKey,role){const info=characterInfo[characterKey];return{emotion:role==='active'?(info?.emotion||'focused'):'quiet',pose:role==='active'?'guard':'rest',motion:role==='active'?'hold':'watch',expression:role==='active'?(info?.emotion||'neutral'):'neutral',shift:role==='active'?1:.5,tilt:0}}
function relationshipFor(focus,counterpart){if(!focus||!counterpart||focus===counterpart)return{focus:baseVisual(focus,'active'),counterpart:baseVisual(counterpart,'responding')};const pair=relationshipVisuals[relationshipKey(focus,counterpart)];return{focus:pair?.[focus]||baseVisual(focus,'active'),counterpart:pair?.[counterpart]||baseVisual(counterpart,'responding')}}
function nearestSpeaker(lines,index,focus){for(let distance=1;distance<lines.length;distance++){for(const candidateIndex of [index-distance,index+distance]){const candidate=lines[candidateIndex]?.speaker;if(candidate&&candidate!==focus)return candidate}}return null}
function resolveStageContext(lines,index){const line=lines[index]||{};const focus=line.speaker||currentTrial()[2];let counterpart=nearestSpeaker(lines,index,focus);if(!counterpart||counterpart===focus)counterpart=companionFor(focus,state.trial);return{focus,counterpart}}
function setCharacterVisual(element,key,profile,role,target){const keyIndex=characterStageOrder.indexOf(key),targetIndex=characterStageOrder.indexOf(target);let direction=0;if((role==='active'||role==='responding')&&keyIndex>-1&&targetIndex>-1&&keyIndex!==targetIndex)direction=keyIndex<targetIndex?1:-1;const motion=motionProfiles[profile.motion]||motionProfiles.watch,expression=expressionVisuals[profile.expression]||expressionVisuals.neutral,shift=role==='watching'?0:(profile.shift||.8),scale=profile.scale||(role==='active'?1.06:role==='responding'?1.01:.98);element.style.setProperty('--gesture-x',`${direction*shift}%`);element.style.setProperty('--gesture-y',role==='watching'?'0%':`${role==='active'?-1.2:-.4}%`);element.style.setProperty('--gesture-rotate',`${direction*(profile.tilt||0)}deg`);element.style.setProperty('--gesture-scale',String(scale));element.style.setProperty('--motion-x',`${direction*motion.travel}%`);element.style.setProperty('--motion-x-soft',`${direction*motion.travel*.45}%`);element.style.setProperty('--motion-x-soft-negative',`${-direction*motion.travel*.45}%`);element.style.setProperty('--motion-lift',`-${motion.lift}px`);element.style.setProperty('--motion-lift-soft',`-${motion.lift*.55}px`);element.style.setProperty('--motion-rotate',`${direction*motion.tilt}deg`);element.style.setProperty('--motion-rotate-soft',`${direction*motion.tilt*.45}deg`);element.style.setProperty('--motion-rotate-soft-negative',`${-direction*motion.tilt*.45}deg`);element.style.setProperty('--motion-speed',`${motion.speed}s`);element.style.setProperty('--motion-scale-peak',motion===motionProfiles.loom?'1.028':'1.014');element.style.setProperty('--expression-tilt',`${expression.tilt}deg`);element.style.setProperty('--expression-squint',String(expression.squint));element.style.setProperty('--expression-mouth-width',expression.mouth);element.style.setProperty('--expression-mouth-rotate',`${expression.rotate}deg`);element.style.setProperty('--expression-glow',expression.glow);element.style.setProperty('--expression-color',expression.color);element.dataset.role=role;element.dataset.emotion=profile.emotion;element.dataset.pose=profile.pose;element.dataset.motion=profile.motion;element.dataset.expression=profile.expression;element.dataset.counterpart=target||'';element.dataset.facing=direction>0?'right':direction<0?'left':'center';element.dataset.beat=`${state.chapter}-${state.trial}-${state.mode}-${state.lineIndex}-${role}`}
function normalizeScriptedLines(scripted){return scripted.map((line,index)=>{const kind=line.kind==='旁白'?(index===0?'场景字幕':index===scripted.length-1?'转场字幕':'场景讲解'):line.kind==='对白'?'角色对白':line.kind;return{...line,kind}})}
function buildStoryLines(){const key=`${state.chapter}:${state.trial}`,scripted=sceneScripts[key];if(scripted)return normalizeScriptedLines(scripted);const trial=currentTrial(),beat=window.sceneNarratives?.[key],speaker=trial[2],companion=beat?.replySpeaker||companionFor(speaker,state.trial);if(beat)return[
  {kind:'场景字幕',speaker:null,text:`${trial[0]}。${trial[1]}`},
  {kind:'场景讲解',speaker:null,text:beat.context},
  {kind:'角色对白',speaker,text:beat.lead},
  {kind:'角色对白',speaker:companion,text:beat.reply},
  {kind:'角色对白',speaker,text:beat.resolve},
  {kind:'转场字幕',speaker:null,text:beat.outro}
];const sentences=trial[1].split(/(?<=[。！？])/).filter(Boolean);return[
  {kind:'场景字幕',speaker:null,text:`${trial[0]}。${sentences[0]||trial[1]}`},
  {kind:'场景讲解',speaker:null,text:'这一幕的来处尚未补写，但前路仍在等待师徒把话说清。'},
  {kind:'角色对白',speaker,text:voiceFragments[speaker][state.trial]},
  {kind:'角色对白',speaker:companion,text:`${characterInfo[companion].name}低声道：“${sentences[1]||'先别急，听清这阵风要把我们带到哪里。'}”`},
  {kind:'角色对白',speaker,text:'“那便先护住同行的人，再把这一关走明白。”'},
  {kind:'转场字幕',speaker:null,text:'夜色压低了舞台，故事暂时停在需要作出决定的地方。'}
]}
function buildResponseLines(index){const trial=currentTrial(),speaker=trial[2],companion=companionFor(speaker,index+1),action=actionSets[(state.chapter+state.trial)%actionSets.length][index];return[
  {kind:'抉择回声',speaker,text:`“${action}。”${characterInfo[speaker].name}把目光从险处收回，像把一把刀重新放回鞘中。`},
  {kind:'转场字幕',speaker:null,text:`${trial[0]}的余韵还在。${characterInfo[companion].name}接住你的决定，四道影子朝下一段路重新站定。`}
]}
function activeLines(){return state.mode==='response'?buildResponseLines(state.pendingChoice||0):buildStoryLines()}
function applyCharacterState(){const stateKey=`${state.chapter}:${state.trial}`,art={...defaultCharacterArt,...(characterStateArt[stateKey]||{})};Object.entries(art).forEach(([id,src])=>{const image=$(`#${id} img`);if(image){if(!image.dataset.anchorBound){image.addEventListener('load',updateCharacterAnchors);image.dataset.anchorBound='true'}if(image.getAttribute('src')!==src)image.src=src}});document.querySelectorAll('.character').forEach(element=>element.classList.toggle('visible',Boolean(characterStateArt[stateKey]?.[element.id])));updateCharacterAnchors()}
function setSpeaker(speakerKey,kind,context={}){const info=speakerKey?characterInfo[speakerKey]:null;const focusKey=context.focus||speakerKey;const counterpartKey=context.counterpart||companionFor(focusKey,state.trial);const relation=relationshipFor(focusKey,counterpartKey);$('#lineType').textContent=kind;$('#speakerSeal').textContent=info?info.seal:'旁';$('#speakerName').textContent=info?info.name:'旁白';$('#speakerRole').textContent=info?info.role:currentSceneMeta().name;document.querySelectorAll('.character').forEach(element=>{const key=characterKeyById[element.id];let role='watching',profile=baseVisual(key,'watching'),target=counterpartKey;if(key===focusKey){role='active';profile=relation.focus;target=counterpartKey}else if(key===counterpartKey){role='responding';profile=relation.counterpart;target=focusKey}setCharacterVisual(element,key,profile,role,target);element.classList.toggle('active',role==='active');element.classList.toggle('responding',role==='responding')})}
function renderChoices(){const actions=actionSets[(state.chapter+state.trial)%actionSets.length],list=$('#choiceList');list.innerHTML=actions.map((action,index)=>`<button type="button" class="choice-button" data-choice="${index}" data-num="${index+1}">${action}</button>`).join('');list.querySelectorAll('.choice-button').forEach(button=>button.addEventListener('click',()=>choose(Number(button.dataset.choice))))}
function renderLine(){const lines=activeLines(),line=lines[Math.min(state.lineIndex,lines.length-1)],context=resolveStageContext(lines,state.lineIndex),copy=$('.story-copy'),isChoice=state.mode==='choices',lineKind=isChoice?'行动抉择':line.kind;copy.classList.remove('line-change');void copy.offsetWidth;copy.classList.add('line-change');if(isChoice){setSpeaker(null,lineKind,context);renderChoices()}else{setSpeaker(line.speaker,lineKind,context)}$('#dialogueTitle').textContent=isChoice?'这一幕的决定':currentTrial()[0];$('#dialogueText').textContent=isChoice?`故事已演至关口。你会如何回应“${currentTrial()[0]}”留下的问题？`:line.text;advanceButton.hidden=isChoice;advanceButton.innerHTML=state.mode==='story'&&state.lineIndex===lines.length-1?'作出决定 <span>→</span>':state.mode==='response'&&state.lineIndex===lines.length-1?'继续西行 <span>→</span>':'继续 <span>→</span>';$('#choiceList').hidden=!isChoice;dialogueDeck.dataset.lineKind=lineKind;dialogueDeck.classList.toggle('choice-ready',isChoice);dialogueDeck.classList.toggle('response-mode',state.mode==='response');dialogueDeck.classList.toggle('narration-mode',!isChoice&&!line.speaker);dialogueDeck.classList.toggle('subtitle-mode',lineKind==='场景字幕'||lineKind==='转场字幕');if(state.auto&&!isChoice){clearTimeout(autoTimer);autoTimer=setTimeout(advance,lineKind==='场景字幕'?3900:3300)}else{clearTimeout(autoTimer)}}
function render(){const chapter=currentChapter(),scene=currentSceneMeta();$('#chapterMark').textContent=chapter.mark;$('#sceneName').textContent=scene.name;$('#locationName').textContent=scene.place;$('#trialLabel').textContent=`第 ${String(trialNumber()).padStart(2,'0')} / 81 难`;applyCharacterState();$('#journalCount').textContent=`${state.marks.length} 条选择`;$('#soundState').textContent=state.sound?'已开启':'已静音';$('#autoBtn').setAttribute('aria-pressed',String(state.auto));setBackdrop(chapter);makeParticles();renderLine();requestAnimationFrame(updateCharacterAnchors)}
function playTone(kind){if(!state.sound)return;try{audioContext||=new AudioContext();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type=kind===1?'sine':'triangle';oscillator.frequency.value=kind===0?220:kind===1?330:440;gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.035,audioContext.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.16);oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+.17)}catch(error){}}
function advance(){if(choosing||state.mode==='choices')return;const lines=activeLines();if(state.lineIndex<lines.length-1){state.lineIndex++;save();renderLine();return}if(state.mode==='response'){advanceScene();return}state.mode='choices';state.lineIndex=0;save();renderLine()}
function choose(index){if(choosing||state.mode!=='choices')return;choosing=true;const trial=currentTrial(),scoreKey=['resolve','mercy','insight'][index];state[scoreKey]++;state.pendingChoice=index;state.marks.push({chapter:state.chapter,trial:state.trial,choice:index,label:trial[0],text:actionSets[(state.chapter+state.trial)%actionSets.length][index]});state.mode='response';state.lineIndex=0;save();playTone(index);render();setTimeout(()=>{choosing=false},180)}
function advanceScene(){app.classList.add('scene-shift');if(state.chapter===8&&state.trial===8){save();setTimeout(()=>{app.classList.remove('scene-shift');finish()},280);return}state.trial++;if(state.trial>8){state.trial=0;state.chapter++}state.mode='story';state.lineIndex=0;state.pendingChoice=null;save();setTimeout(()=>{render();app.classList.remove('scene-shift')},280)}
function openPause(){const menu=$('#pauseMenu');menu.classList.add('open');menu.setAttribute('aria-hidden','false');$('#pauseBtn').setAttribute('aria-expanded','true')}
function closePause(){const menu=$('#pauseMenu');menu.classList.remove('open');menu.setAttribute('aria-hidden','true');$('#pauseBtn').setAttribute('aria-expanded','false')}
function openOverlay(kind){const body=$('#overlayBody');if(kind==='journey'){body.innerHTML=`<h2>九九长路</h2><p>每一难先演出，再把决定交给你。完成的难关会留在旅痕簿。</p><div class="chapter-grid">${chapterData.map((chapter,index)=>`<button type="button" class="chapter-button ${index===state.chapter?'current':''}" data-chapter="${index}" ${index>state.chapter?'disabled':''}><b>${chapter.mark} · ${chapter.name}</b><small>${index<state.chapter?'已抵达':index===state.chapter?`第 ${state.trial+1} 难`:'云路未开'}</small></button>`).join('')}</div>`;body.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{state.chapter=Number(button.dataset.chapter);state.trial=0;state.mode='story';state.lineIndex=0;save();render();closeOverlay();closePause()}))}else{body.innerHTML=`<h2>旅痕簿</h2><p>每一次选择都会被写进取经路。当前共 ${state.marks.length} 道旅痕。</p>${state.marks.length?state.marks.slice().reverse().map(mark=>`<article class="journal-entry"><b>第 ${mark.chapter*9+mark.trial+1} 难 · ${mark.label}</b><p>${mark.text}</p></article>`).join(''):'<p>尚未留下旅痕。</p>'}`}$(`#overlayPanel`).classList.add('open');$('#overlayPanel').setAttribute('aria-hidden','false')}
function closeOverlay(){$('#overlayPanel').classList.remove('open');$('#overlayPanel').setAttribute('aria-hidden','true')}
function finish(){const total=state.resolve+state.mercy+state.insight;let title,text,seal;if(state.mercy>=state.resolve&&state.mercy>=state.insight){title='慈航无界';seal='慈';text='你始终把眼前的人放在胜负之前。灵山没有替你写下终点，只留下一盏照向来路的灯。'}else if(state.resolve>=state.insight){title='金身照夜';seal='勇';text='你以决断劈开八十一难。封号落下时，影子仍替你守在每一处曾经犹疑的路口。'}else{title='无字真经';seal='悟';text='你没有急着索取答案。经卷落在手里仍有空白，而空白正等着下一次出发。'}$('#endingSeal').textContent=seal;$('#endingTitle').textContent=title;$('#endingText').textContent=text;$('#endingStats').innerHTML=`<span><b>${total}</b>旅痕</span><span><b>${state.mercy}</b>慈念</span><span><b>${state.insight}</b>悟见</span>`;$('#endingModal').classList.add('open');$('#endingModal').setAttribute('aria-hidden','false')}
function reset(){state={chapter:0,trial:0,resolve:0,mercy:0,insight:0,marks:[],sound:state.sound,auto:false,mode:'story',lineIndex:0,pendingChoice:null,narrativeVersion};save();$('#endingModal').classList.remove('open');closePause();render()}
$('#advanceBtn').addEventListener('click',advance);$('#pauseBtn').addEventListener('click',()=>$('#pauseMenu').classList.contains('open')?closePause():openPause());$('#closeMenu').addEventListener('click',closePause);$('#pauseMenu').querySelector('.pause-backdrop').addEventListener('click',closePause);$('#journeyBtn').addEventListener('click',()=>openOverlay('journey'));$('#journalBtn').addEventListener('click',()=>openOverlay('journal'));$('#closeOverlay').addEventListener('click',closeOverlay);$('#overlayPanel').querySelector('.overlay-backdrop').addEventListener('click',closeOverlay);$('#soundBtn').addEventListener('click',()=>{state.sound=!state.sound;save();render();playTone(1)});$('#resetBtn').addEventListener('click',reset);$('#restartJourney').addEventListener('click',reset);$('#autoBtn').addEventListener('click',()=>{state.auto=!state.auto;save();render();playTone(2)});$('#skipBtn').addEventListener('click',()=>{if(state.mode==='story'){state.lineIndex=activeLines().length-1;renderLine()}else if(state.mode==='response'){state.lineIndex=activeLines().length-1;renderLine()}else{document.querySelector('#choiceList .choice-button')?.focus()}playTone(2)});document.addEventListener('keydown',event=>{if(['1','2','3'].includes(event.key)&&state.mode==='choices'){document.querySelector(`.choice-button[data-choice="${Number(event.key)-1}"]`)?.click()}if((event.key==='Enter'||event.key===' ')&&state.mode!=='choices'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){event.preventDefault();advance()}if(event.key==='Escape'){closeOverlay();closePause()}});window.addEventListener('resize',updateCharacterAnchors,{passive:true});makeParticles();render();
