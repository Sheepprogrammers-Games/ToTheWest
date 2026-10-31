(() => {
  'use strict';

  const characterInfo = Object.freeze({
    群猴: Object.freeze({ id: 'monkey-clan', name: '花果山群猴', role: '水帘洞众猴', seal: '猴' }),
    龙王: Object.freeze({ id: 'dragon-king', name: '东海龙王', role: '东海龙宫之主', seal: '龙' }),
    阎王: Object.freeze({ id: 'yanluo', name: '十殿阎王', role: '幽冥司主', seal: '冥' }),
    太白: Object.freeze({ id: 'taibai', name: '太白金星', role: '天庭招安使者', seal: '白' }),
    玉帝: Object.freeze({ id: 'jade-emperor', name: '玉皇大帝', role: '天庭之主', seal: '玉' }),
    王母: Object.freeze({ id: 'queen-mother', name: '西王母', role: '瑶池之主', seal: '瑶' }),
    哪吒: Object.freeze({ id: 'nezha', name: '哪吒三太子', role: '中坛元帅', seal: '哪' }),
    李靖: Object.freeze({ id: 'li-jing', name: '托塔天王', role: '降魔大元帅', seal: '塔' }),
    二郎: Object.freeze({ id: 'erlang', name: '二郎显圣真君', role: '灌江口真君', seal: '真' }),
    老君: Object.freeze({ id: 'laojun', name: '太上老君', role: '兜率宫道祖', seal: '道' }),
    唐王: Object.freeze({ id: 'tang-emperor', name: '唐太宗', role: '大唐皇帝', seal: '唐' }),
    魏征: Object.freeze({ id: 'wei-zheng', name: '魏征', role: '大唐丞相', seal: '魏' }),
    白龙: Object.freeze({ id: 'white-dragon', name: '小白龙', role: '西海龙王三太子', seal: '骥' }),
    金池: Object.freeze({ id: 'jinchi', name: '金池长老', role: '观音院住持', seal: '池' }),
    女王: Object.freeze({ id: 'daughter-queen', name: '西梁女王', role: '女儿国国王', seal: '女' }),
    六耳: Object.freeze({ id: 'six-eared', name: '六耳猕猴', role: '假行者', seal: '六' }),
    镇元: Object.freeze({ id: 'zhenyuan', name: '镇元大仙', role: '五庄观主人', seal: '元' }),
    老鼋: Object.freeze({ id: 'old-turtle', name: '通天河老鼋', role: '通天河渡者', seal: '鼋' }),
    黄袍: Object.freeze({ id: 'yellow-robed', name: '黄袍怪', role: '奎木狼下界', seal: '奎' }),
    灵吉: Object.freeze({ id: 'lingji', name: '灵吉菩萨', role: '飞龙宝杖之主', seal: '吉' }),
    弥勒: Object.freeze({ id: 'maitreya', name: '弥勒佛', role: '东来佛祖', seal: '弥' }),
    寿星: Object.freeze({ id: 'longevity-star', name: '南极寿星', role: '南极仙翁', seal: '寿' })
  });

  const choice = (id, label, trait, text, outcome, extra = {}) => Object.freeze({
    id,
    label,
    trait,
    text,
    outcome,
    relations: Object.freeze({}),
    flags: Object.freeze({}),
    routes: Object.freeze({}),
    action: trait === 'resolve' ? 'advance' : trait === 'mercy' ? 'guard' : 'consider',
    feedback: '',
    ...extra
  });

  const sceneChoices = Object.freeze({
    '0:0': Object.freeze([
      choice('meet-the-light', '迎光起身', 'resolve', '撑开石壳，迎着第一束天光站起来。', '石猴把未知当作邀请，群猴记住了他睁眼时毫不退缩的样子。', { flags: { bornDefiant: true }, routes: { defiance: 1 }, action: 'startle' }),
      choice('listen-to-mountain', '听山风', 'insight', '先听水声、鸟声与群猴的呼吸，再迈出第一步。', '石猴先认识花果山的声音，日后总能比旁人更早察觉山林异动。', { flags: { mountainListener: true }, routes: { insight: 1 }, action: 'consider' }),
      choice('reach-for-clan', '伸手回应', 'mercy', '向围拢来的群猴伸出手，不让惊惧先隔开彼此。', '群猴的戒心很快散去，花果山从第一眼便有了同行之意。', { relations: { 群猴: 2 }, routes: { bond: 1 }, feedback: '花果山群猴开始亲近你' })
    ]),
    '0:1': Object.freeze([
      choice('leap-first', '纵身穿瀑', 'resolve', '不再试探，借石壁一踏穿进水帘。', '石猴夺得先机，也把自己置于最危险的落脚处。', { relations: { 群猴: 1 }, flags: { waterCurtainBold: true }, routes: { defiance: 1 }, action: 'strike' }),
      choice('read-the-current', '辨清水势', 'insight', '观察水帘后的回声与石缝，再选最稳的落点。', '洞口暗流被逐一看清，后来带群猴迁入时无人跌伤。', { relations: { 群猴: 2 }, flags: { waterCurtainClever: true }, routes: { insight: 1 }, feedback: '群猴更信服你的判断' }),
      choice('promise-a-home', '先许众猴', 'mercy', '先说若有安身处，必回来接所有同伴。', '石猴尚未称王，先把水帘洞许作众猴共同的家。', { relations: { 群猴: 3 }, flags: { kingByPromise: true }, routes: { bond: 2 }, feedback: '群猴拥戴之心明显上升' })
    ]),
    '0:2': Object.freeze([
      choice('sail-for-life', '即刻出海', 'resolve', '扎起木筏，当夜便去寻跳出轮回的道路。', '求道之路提前启程，花果山记住了猴王独自驶入夜海的背影。', { relations: { 群猴: -1 }, flags: { soughtImmortality: true }, routes: { defiance: 1 }, feedback: '群猴担忧你离去，却无人能拦住你' }),
      choice('settle-the-clan', '安顿群猴', 'mercy', '先安排年长者与幼猴的饮食洞府，再与众猴作别。', '猴王把惧死化为责任，离山时没有留下无人照看的洞府。', { relations: { 群猴: 3 }, flags: { clanSettled: true }, routes: { bond: 2 }, feedback: '花果山群猴对你的信赖上升' }),
      choice('silent-before-death', '沉默不语', 'insight', '把酒盏放下，独自坐到天明，不向众猴解释落泪的原因。', '群猴不懂这场沉默；石猴却第一次听见生死在心中敲门。', { relations: { 群猴: -1 }, flags: { mortalitySilence: true }, routes: { insight: 2 }, feedback: '群猴不明白你的沉默' })
    ]),
    '0:3': Object.freeze([
      choice('kneel-and-ask', '叩门求道', 'mercy', '伏地陈明漂洋过海的来意，请祖师收留。', '菩提看见的不只是求长生之心，还有肯低头求教的诚意。', { relations: { 菩提: 3 }, flags: { bodhiHumble: true }, routes: { discipline: 2 }, feedback: '菩提祖师认可了你的诚心', action: 'bow' }),
      choice('answer-honestly', '直陈本心', 'resolve', '承认自己怕死，也承认不愿让命数替自己作主。', '直白虽显桀骜，却没有用漂亮话遮掩本心。', { relations: { 菩提: 1 }, flags: { bodhiHonest: true }, routes: { defiance: 1 }, feedback: '菩提祖师记住了你的坦率' }),
      choice('wait-in-silence', '沉默候问', 'insight', '不抢着辩解，只在阶前长跪，等祖师开口。', '斜月三星洞的门没有立刻打开；耐心却替石猴答了第一问。', { relations: { 菩提: 2 }, flags: { bodhiPatient: true }, routes: { insight: 2 }, feedback: '菩提祖师认可了你的耐心', action: 'bow' })
    ]),
    '0:4': Object.freeze([
      choice('receive-the-name', '欣然受名', 'mercy', '叩首领受“孙悟空”三字，把名字当作师门所赐。', '从此石猴有名、有师承，也有了需要珍惜的门中缘分。', { relations: { 菩提: 2 }, flags: { nameReceived: true }, routes: { bond: 1 }, feedback: '你与菩提祖师的师徒情分加深' }),
      choice('ask-the-meaning', '追问其义', 'insight', '请祖师讲明“悟空”二字，先知其义再领其名。', '祖师不恼，反问他能否看破顽空；一问一答成了入门第一课。', { relations: { 菩提: 1 }, flags: { nameUnderstood: true }, routes: { insight: 2 } }),
      choice('bow-without-words', '沉默叩首', 'resolve', '不说欢喜，只郑重叩首，把名字牢牢记住。', '无言之礼比欢呼更重，祖师也看见了顽猴少有的肃然。', { relations: { 菩提: 2 }, flags: { nameSilentVow: true }, routes: { discipline: 1 }, action: 'bow' })
    ]),
    '0:5': Object.freeze([
      choice('guard-the-secret', '谨守师嘱', 'insight', '学成后收住神通，不在同门面前卖弄变化。', '悟空将本事藏在日常洒扫里，祖师的警告暂时压住了好胜心。', { relations: { 菩提: 3 }, flags: { keptBodhiSecret: true }, routes: { discipline: 2 }, feedback: '菩提祖师对你的信任上升' }),
      choice('show-one-change', '小试变化', 'resolve', '只变一次松树博同门喝彩，自信不会惹出大事。', '喝彩惊动祖师；悟空尝到卖弄的快意，也让离山之日提前。', { relations: { 菩提: -3 }, flags: { showedOffMagic: true }, routes: { defiance: 2 }, feedback: '菩提祖师不认同你的卖弄' }),
      choice('ask-before-leaving', '请教归处', 'mercy', '察觉祖师忧色，先问若有一日离山，该怎样不辱师门。', '祖师仍命他不可泄露师承，却在逐客的话里多留了一分告诫。', { relations: { 菩提: 2 }, flags: { bodhiFarewellHeard: true }, routes: { bond: 1, discipline: 1 } }),
      choice('silent-at-the-door', '沉默不语', 'insight', '听懂逐客之意，不争辩，只在洞门外再拜三次。', '祖师没有回头；这场无声告别却伴随悟空很久。', { relations: { 菩提: 1 }, flags: { bodhiSilentFarewell: true }, routes: { insight: 1 }, action: 'bow' })
    ]),
    '0:6': Object.freeze([
      choice('borrow-with-courtesy', '依礼借宝', 'mercy', '说明护山之需，逐件试过兵器，再向龙王借神珍铁。', '金箍棒仍随悟空而去，但龙宫把此事记作一桩难还的人情。', { relations: { 龙王: 2 }, flags: { dragonDeal: 'courtesy' }, routes: { bond: 2 }, feedback: '东海龙王虽肉痛，仍认可你的礼数' }),
      choice('press-the-palace', '逼宫索宝', 'resolve', '嫌兵器太轻，逼四海龙王交出披挂与定海神珍。', '悟空威势大涨，龙宫却把借宝写成了强夺，日后必上天庭申告。', { relations: { 龙王: -4 }, flags: { dragonDeal: 'coerced', dragonComplaint: true }, routes: { defiance: 3 }, feedback: '东海龙王对你的好感大幅下降', action: 'strike' }),
      choice('test-the-needle', '先试神珍', 'insight', '循霞光找到海藏中发亮的铁柱，先确认它是否真能随心变化。', '悟空凭眼力认出金箍棒，没有多毁龙宫陈设，却仍取走披挂。', { relations: { 龙王: 0 }, flags: { dragonDeal: 'measured' }, routes: { insight: 2 } }),
      choice('take-and-say-nothing', '沉默取棒', 'resolve', '收起金箍棒和披挂，不解释，也不回看龙王脸色。', '这份沉默比威吓更令龙宫不安；一纸诉状很快会送上天庭。', { relations: { 龙王: -3 }, flags: { dragonDeal: 'silent', dragonComplaint: true }, routes: { defiance: 2 }, feedback: '东海龙王把你的沉默视为轻慢' })
    ]),
    '0:7': Object.freeze([
      choice('erase-the-clan', '尽销猴属', 'resolve', '夺过朱笔，将猴属有名者一概勾去。', '花果山暂脱生死册束缚，幽冥却把这笔账完整记下。', { relations: { 群猴: 3, 阎王: -4 }, flags: { underworldMethod: 'force' }, routes: { defiance: 3 }, feedback: '幽冥对你的敌意大幅上升', action: 'strike', answer: '“你今日这般强销，幽冥记下的就不是一页纸，是一整座花果山。”', reply: '“记下便记下。花果山的名字，不该再躺在你们簿上。”' }),
      choice('question-the-ledger', '先问命数', 'insight', '逼阎王讲明寿数由谁勾定，再销去猴属名号。', '悟空仍改了生死簿，却看清天、地、幽冥互相推诿的秩序。', { relations: { 阎王: -2 }, flags: { underworldMethod: 'questioned' }, routes: { insight: 2, defiance: 1 }, answer: '“寿数由天、由地、由幽冥互相推。你问得清，也改不了这套推诿。”', reply: '“推诿我也听见了。听见了，这几页还是要勾。”' }),
      choice('mark-the-debt', '留字担责', 'mercy', '销去猴属后留下姓名，明言此事由孙悟空一人承担。', '幽冥照样震动，群猴却不必替猴王背下全部罪名。', { relations: { 群猴: 2, 阎王: -2 }, flags: { underworldMethod: 'owned' }, routes: { bond: 2 }, feedback: '群猴感念你独自担下幽冥之责', answer: '“你把罪名揽到自己身上，幽冥便只拿你一人来问。”', reply: '“拿我一人便是。群猴的名字，从今日起不在这簿上。”' })
    ]),
    '0:8': Object.freeze([
      choice('accept-and-watch', '受职察看', 'insight', '先随太白上天，借御马监看清天庭规矩与虚实。', '悟空暂受弼马温之职，把受封当作观察天庭的一扇门。', { relations: { 太白: 2, 玉帝: 1 }, flags: { heavenEntry: 'observe' }, routes: { insight: 2 }, cast: ['悟空', '太白'] }),
      choice('ask-the-rank', '当面问品', 'resolve', '受封前先问官品俸秩，不肯含糊接下天庭名号。', '众仙避而不答，悟空虽进御马监，心中已埋下疑刺。', { relations: { 太白: -1, 玉帝: -1 }, flags: { heavenEntry: 'skeptical' }, routes: { defiance: 1 }, feedback: '天庭认为你难以安抚', cast: ['悟空', '玉帝'] }),
      choice('say-nothing', '沉默领旨', 'mercy', '不在殿上争辩，先领职照看天马。', '玉帝把沉默当作顺从；太白却看出猴王只是在等一个答案。', { relations: { 太白: 1 }, flags: { heavenEntry: 'silent' }, routes: { discipline: 1 }, cast: ['悟空', '太白'] })
    ]),
    '1:0': Object.freeze([
      choice('raise-the-banner', '竖旗称圣', 'resolve', '回山立起“齐天大圣”旌旗，公开拒绝末等官职。', '旗号震动三界，花果山士气大振，天庭再不能装作没看见。', { relations: { 群猴: 3, 玉帝: -3 }, flags: { greatSageClaim: 'banner' }, routes: { defiance: 3 }, feedback: '花果山群猴士气上升，天庭敌意上升' }),
      choice('send-back-the-seal', '退印明志', 'insight', '遣人送回官印，写明受辱缘由，再自号齐天。', '天庭收到一封无法假装看不懂的退职书，太白也更容易再来周旋。', { relations: { 太白: 1, 玉帝: -2 }, flags: { greatSageClaim: 'letter' }, routes: { insight: 2, defiance: 1 } }),
      choice('quietly-leave', '沉默离天', 'mercy', '不伤御马监一人，解开天马缰绳后独自下界。', '天马奔腾而出，沉默的离职比殿前叫骂更叫天庭难堪。', { relations: { 玉帝: -2 }, flags: { greatSageClaim: 'silent' }, routes: { discipline: 1, defiance: 1 } })
    ]),
    '1:1': Object.freeze([
      choice('accept-empty-title', '暂受空封', 'insight', '先住进齐天府，观察这道空名背后真正的打算。', '悟空没有被虚名哄住，却也给双方留下了一段短暂缓冲。', { relations: { 太白: 2, 玉帝: 1 }, flags: { emptyTitle: 'watched' }, routes: { insight: 2 } }),
      choice('demand-real-duty', '索要实职', 'resolve', '当面追问齐天大圣掌什么事，不肯只领一座空府。', '玉帝不愿给权，天庭与猴王的裂缝当场显露。', { relations: { 玉帝: -3 }, flags: { emptyTitle: 'challenged' }, routes: { defiance: 2 }, feedback: '玉皇大帝不认同你的逼问' })
    ]),
    '1:2': Object.freeze([
      choice('taste-one-peach', '尝一枚熟桃', 'resolve', '摘下一枚九千年熟桃，亲自试试天庭所谓禁果。', '一枚之后再难停手，蟠桃园的规矩从内部裂开。', { relations: { 王母: -2 }, flags: { peachChoice: 'ate' }, routes: { defiance: 2 }, feedback: '王母的戒心上升', play: true }),
      choice('count-the-grove', '查清桃期', 'insight', '先问土地、力士，记下三等蟠桃成熟与入宴的去处。', '悟空看清桃园不是果园，而是天庭分配寿数与席位的一本账。', { flags: { peachChoice: 'counted' }, routes: { insight: 2 } }),
      choice('share-with-workers', '分桃众役', 'mercy', '把熟桃分给终年守园却无缘赴会的力士仙吏。', '桃香传遍园门，王母震怒；底层仙吏却第一次分到蟠桃。', { relations: { 王母: -3 }, flags: { peachChoice: 'shared' }, routes: { bond: 2, defiance: 1 }, feedback: '王母对你的好感下降，守园仙吏暗中感激', play: true })
    ]),
    '1:3': Object.freeze([
      choice('ask-for-a-seat', '直闯问席', 'resolve', '走进瑶池，当着众仙问齐天大圣为何不在宴帖上。', '无人正面作答；悟空在沉默中看清空封究竟有多空。', { relations: { 王母: -3, 玉帝: -2 }, flags: { banquetResponse: 'confronted' }, routes: { defiance: 3 }, feedback: '瑶池众仙把你视为公然挑衅' }),
      choice('carry-wine-home', '带酒归山', 'mercy', '饮酒后把余酿带回花果山，与未受天庭看重的群猴同饮。', '御酒流到水帘洞，天庭失窃，群猴却把这一夜当作自己的蟠桃会。', { relations: { 群猴: 3, 王母: -2 }, flags: { banquetResponse: 'shared' }, routes: { bond: 3 }, feedback: '花果山群猴对你的好感上升' })
    ]),
    '1:4': Object.freeze([
      choice('swallow-the-elixir', '尽吞金丹', 'resolve', '将五壶金丹当作炒豆尽数吞下，断绝天庭收回的可能。', '金丹炼入五脏，悟空的金刚之躯更难被天刑所伤。', { relations: { 老君: -4 }, flags: { elixirChoice: 'all' }, routes: { defiance: 3 }, feedback: '太上老君对你的敌意大幅上升' }),
      choice('inspect-the-furnace', '先辨丹性', 'insight', '认出葫芦封签与炉火余温，再有选择地吞下金丹。', '悟空虽醉，仍记下兜率宫炉位与巽风；这份记忆日后救了他。', { relations: { 老君: -3 }, flags: { elixirChoice: 'studied', knowsXunGate: true }, routes: { insight: 3 }, feedback: '你记住了八卦炉的巽位' }),
      choice('leave-one-gourd', '留下一壶', 'mercy', '吞下大半，仍留一壶给老君救治丹童仙吏。', '盗丹之罪没有消失，却没有把兜率宫彻底掏空。', { relations: { 老君: -2 }, flags: { elixirChoice: 'spared' }, routes: { bond: 1, discipline: 1 } })
    ]),
    '1:5': Object.freeze([
      choice('hold-the-gate', '守住山门', 'mercy', '不追天兵远去，只守住水帘洞与惊散的群猴。', '大圣把胜负压在家门以内，花果山损伤较轻，天兵也难诱他离阵。', { relations: { 群猴: 4, 哪吒: 0 }, flags: { havocStyle: 'protector' }, routes: { bond: 3, discipline: 1 }, feedback: '群猴深受鼓舞，天庭改变了围攻阵形', action: 'guard', cast: ['悟空', '哪吒'] }),
      choice('challenge-nezha', '阵前斗哪吒', 'resolve', '跃上云头，正面迎战哪吒的三头六臂。', '两般变化在云阵中硬碰，悟空威名大涨，也把自己暴露在天罗地网中央。', { relations: { 哪吒: 1, 李靖: -3 }, flags: { havocStyle: 'duel' }, routes: { defiance: 3 }, feedback: '哪吒认可你的武艺，李靖对你的敌意上升', action: 'strike', cast: ['悟空', '哪吒'], play: true, speech: '哪吒，你这三头六臂刚才那几招，还没挡住俺也去这根棒。', answer: '“齐天大圣果然不是空名。可李靖的天罗地网，下一阵不会再给你对打的空档。”', reply: '天网便天网。花果山还在，俺也去便还在。' }),
      choice('break-the-formation', '先破天网', 'insight', '不恋战神将，先找天罗地网的阵眼与鼓令。', '天兵阵势数次被切断，李靖被迫收缩包围，花果山得到喘息。', { relations: { 李靖: -2, 群猴: 2 }, flags: { havocStyle: 'tactician' }, routes: { insight: 3 }, feedback: '天兵的围阵被你看出破绽', cast: ['悟空', '李靖'] }),
      choice('answer-with-silence', '沉默横棒', 'resolve', '不回天将劝降，只横棒守在山门之前。', '沉默让劝降失去落脚处；第一声战鼓由天庭敲响。', { relations: { 太白: -1, 群猴: 2 }, flags: { havocStyle: 'silent' }, routes: { defiance: 2 }, feedback: '太白金星没能劝你退兵', cast: ['悟空', '太白'] })
    ]),
    '1:6': Object.freeze([
      choice('match-every-change', '逐变相斗', 'resolve', '二郎变什么便跟着变什么，要在每一式上分个高下。', '斗法惊动山河，双方谁也压不住谁，却给梅山兄弟围山留下时间。', { relations: { 二郎: 2, 群猴: -2 }, flags: { erlangDuel: 'matched' }, routes: { defiance: 2 }, feedback: '二郎真君认可你的变化，花果山却承受更多围攻', play: true, speech: '你变，俺也去也变。刚才那几手，谁也没压住谁。', answer: '“七十二变比的不只是形。你护山的心思，我看明白了。”', reply: '看明白也没用。下一手，还是这根棒。' }),
      choice('draw-him-away', '引离花果山', 'mercy', '故意向远山变化奔走，把二郎与梅山兵将引离群猴。', '悟空失去地利，却替水帘洞分走最强的追兵。', { relations: { 群猴: 3, 二郎: 1 }, flags: { erlangDuel: 'lured' }, routes: { bond: 3 }, feedback: '群猴免受一轮围攻', answer: '“你把战火引向自己，这山后的群猴，我便暂且不入。军令还在，下一阵仍要见你。”', reply: '“护住就够。你要追，俺也去陪你跑到天边。”' }),
      choice('use-the-smallest-form', '藏入细处', 'insight', '不比声势，化作最不起眼之物观察天眼死角。', '二郎仍以天眼识破大半变化，却被这份耐心拖慢追势。', { relations: { 二郎: 1 }, flags: { erlangDuel: 'subtle' }, routes: { insight: 3 } })
    ]),
    '1:7': Object.freeze([
      choice('find-the-xun-gate', '守住巽位', 'insight', '循先前记忆躲到有风无火的巽位，熬过四十九日。', '炉烟炼红双眼，却没有烧化金身；火眼金睛从这道判断中生出。', { relations: { 老君: -2 }, flags: { furnaceEscape: 'xun' }, routes: { insight: 3 }, feedback: '你凭先前线索找到八卦炉生门' }),
      choice('strike-the-furnace', '以身撞炉', 'resolve', '在炉内不断冲击炉壁，等开炉一刻把积蓄的力尽数打出。', '炉门崩开，悟空声势最盛，也把兜率宫砸得更加狼藉。', { relations: { 老君: -4 }, flags: { furnaceEscape: 'force' }, routes: { defiance: 3 }, feedback: '太上老君对你的敌意再次上升', action: 'strike' }),
      choice('endure-in-silence', '沉默忍火', 'mercy', '收住叫骂，不让看炉童子因惊慌再添炉火。', '四十九日的沉默没有换来宽恕，却让无辜丹童少受牵连。', { relations: { 老君: -2 }, flags: { furnaceEscape: 'endured' }, routes: { discipline: 3 } })
    ]),
    '1:8': Object.freeze([
      choice('take-the-wager', '翻出佛掌', 'resolve', '接受赌斗，以筋斗云证明天地未必有边。', '悟空留下记号又回到掌中，五行山随如来一掌落下。', { relations: { 如来: -1 }, flags: { palmWager: 'defied' }, routes: { defiance: 3 }, action: 'advance' }),
      choice('question-the-boundary', '先问何为界', 'insight', '先问佛掌、天涯与自由究竟由谁来划定。', '如来仍设赌局；悟空却在失败前看见力量之外还有因果与尺度。', { relations: { 如来: 1 }, flags: { palmWager: 'questioned' }, routes: { insight: 3 } }),
      choice('fall-silent', '沉默应赌', 'mercy', '不再夸口，沉默翻身上云，把答案交给这一筋斗。', '五指化山时没有多余叫骂，只有不肯认输的目光留在石缝间。', { relations: { 如来: 0 }, flags: { palmWager: 'silent' }, routes: { discipline: 2 } })
    ]),
    '2:0': Object.freeze([
      choice('count-the-seasons', '记住岁月', 'insight', '以山花枯荣计算五百年，不让自己在禁锢中失去时间。', '悟空保住了清醒，也渐渐看见怒意之外漫长的因果。', { flags: { mountainYears: 'remembered' }, routes: { insight: 2, discipline: 1 } }),
      choice('curse-the-heavens', '仍骂天庭', 'resolve', '每逢铁丸铜汁便高声骂天，拒绝让五行山磨平锋芒。', '不服之心从未熄灭；山神畏惧，天庭也更不敢放松看守。', { relations: { 玉帝: -1 }, flags: { mountainYears: 'defiant' }, routes: { defiance: 2 } }),
      choice('listen-for-the-pilgrim', '静候取经人', 'mercy', '记住观音的话，把每阵远方脚步都当作可能的取经人。', '等待第一次不只是忍耐，而是对尚未相识之人的承诺。', { relations: { 观音: 1 }, flags: { mountainYears: 'awaited' }, routes: { bond: 2 }, feedback: '你记住了观音所说的取经之约' })
    ]),
    '2:1': Object.freeze([]),
    '2:2': Object.freeze([]),
    '2:3': Object.freeze([]),
    '2:4': Object.freeze([]),
    '2:5': Object.freeze([]),
    '2:6': Object.freeze([]),
    '2:7': Object.freeze([]),
    '2:8': Object.freeze([]),
    '3:0': Object.freeze([]),
    '3:1': Object.freeze([
      choice('promise-protection', '立誓护送', 'resolve', '悟空答应脱困后护送玄奘直至西天，不中途弃路。', '师徒之约先于紧箍落下，往后每次离别都要面对这句话。', { relations: { 玄奘: 3 }, flags: { rescuePromise: 'vowed' }, routes: { bond: 2, discipline: 1 }, feedback: '玄奘开始信任你' }),
      choice('tell-the-whole-past', '坦陈旧事', 'insight', '把闹龙宫、改生死簿与大闹天宫全数说清，再求玄奘揭帖。', '玄奘没有只听“齐天大圣”的威名，也提前看见这名徒弟的危险。', { relations: { 玄奘: 1 }, flags: { rescuePromise: 'honest' }, routes: { insight: 2 }, feedback: '玄奘认可你的坦率，也对你的杀性保持警惕' }),
      choice('say-nothing-but-wait', '沉默等候', 'mercy', '不催促取经人，只把被山石压住的手掌摊开。', '玄奘从沉默与伤痕中作出决定，救人先于追问。', { relations: { 玄奘: 2 }, flags: { rescuePromise: 'silent' }, routes: { bond: 2 }, feedback: '玄奘因你的克制愿意相救' })
    ]),
    '3:2': Object.freeze([
      choice('bow-as-disciple', '叩首拜师', 'mercy', '脱山后先收住狂喜，向玄奘郑重叩首。', '此刻悟空只有旧时大圣冠与虎皮衣，头上尚无紧箍；师徒名分由一拜落定。', { relations: { 玄奘: 4 }, flags: { releasedWithoutFillet: true, discipleship: 'bowed' }, routes: { bond: 3 }, feedback: '玄奘对你的信任明显上升', action: 'bow' }),
      choice('clear-the-falling-rocks', '先护师父', 'resolve', '山崩时先把玄奘送到安全处，再回身舒展筋骨。', '五百年的第一步不是远走，而是护住刚刚救自己的人。', { relations: { 玄奘: 4 }, flags: { releasedWithoutFillet: true, discipleship: 'guarded' }, routes: { discipline: 2, bond: 1 }, feedback: '玄奘深受触动', action: 'guard' }),
      choice('look-back-at-the-seal', '回望压帖', 'insight', '捡起落下的六字真言，看清禁锢自己五百年的字。', '悟空记住力量之外还有能压住自己的规则；此时他仍未戴紧箍。', { relations: { 如来: 1 }, flags: { releasedWithoutFillet: true, discipleship: 'reflected' }, routes: { insight: 3 } })
    ]),
    '3:3': Object.freeze([
      choice('accept-the-fillet', '认下约束', 'discipline', '得知紧箍来历后不再扯断它，要求玄奘只在真正失控时念咒。', '紧箍已经戴上，师徒第一次试着把约束变成双方都要守的约定。', { trait: 'insight', relations: { 玄奘: 2, 观音: 1 }, flags: { filletWorn: true, filletResponse: 'accepted' }, routes: { discipline: 3, bond: 1 }, feedback: '玄奘认可你的克制，紧箍从此戴上', emotion: 'pained' }),
      choice('rage-at-the-deceit', '怒责欺瞒', 'resolve', '疼痛中质问玄奘与观音为何用骗术相缚。', '悟空仍随师西行，却把这场欺瞒牢牢记住；紧箍成为信任裂痕。', { relations: { 玄奘: -4, 观音: -3 }, flags: { filletWorn: true, filletResponse: 'resented' }, routes: { defiance: 3 }, feedback: '玄奘对你的戒心上升，你不再信任这场安排', emotion: 'angry', action: 'recoil' }),
      choice('endure-in-silence', '沉默忍痛', 'insight', '不求饶也不争辩，直到玄奘停下咒语。', '紧箍仍留在头上；玄奘却无法判断这份沉默是顺服还是疏离。', { relations: { 玄奘: -1 }, flags: { filletWorn: true, filletResponse: 'silent' }, routes: { discipline: 2, insight: 1 }, feedback: '玄奘不理解你的沉默', emotion: 'pained', action: 'recoil' }),
      choice('ask-for-a-rule', '约定咒界', 'mercy', '请玄奘答应不因争执轻念紧箍咒，自己也答应不滥杀。', '紧箍已经戴上，但师徒为它划出一条共同承担的界线。', { relations: { 玄奘: 4 }, flags: { filletWorn: true, filletResponse: 'covenant' }, routes: { bond: 3, discipline: 2 }, feedback: '你与玄奘建立了紧箍之约', emotion: 'pained' })
    ]),
    '3:4': Object.freeze([
      choice('dive-after-the-dragon', '入涧追龙', 'resolve', '立刻分水入涧，逼白龙现身交战。', '悟空把白龙逼出深潭，却也让初见先成了一场恶斗。', { relations: { 白龙: -2, 玄奘: 1 }, flags: { whiteDragonMeeting: 'fought' }, routes: { defiance: 2 }, feedback: '小白龙对你的好感下降', action: 'strike' }),
      choice('call-guanyin-first', '先问观音', 'insight', '从白龙不食人只吞马的异状判断另有因缘，先寻观音。', '白龙身份更快查明，师徒免去一轮无谓水战。', { relations: { 白龙: 2, 观音: 1 }, flags: { whiteDragonMeeting: 'recognized' }, routes: { insight: 2 }, feedback: '小白龙认可你没有赶尽杀绝' }),
      choice('guard-the-stranded', '陪师候援', 'mercy', '先守住失去坐骑的玄奘，不让他独自在陌生涧边。', '行程稍慢，玄奘却第一次感到这名徒弟会留下，而非只顾追敌。', { relations: { 玄奘: 3 }, flags: { whiteDragonMeeting: 'guarded' }, routes: { bond: 3 }, feedback: '玄奘对你的好感上升', action: 'guard' })
    ]),
    '3:5': Object.freeze([
      choice('hide-the-robe', '劝藏袈裟', 'insight', '按住师父的手，不让金池在灯下展开宝衣。', '你把袈裟重新裹进包袱。金池脸上的笑意一下子薄了，后半夜禅房外仍有火光，你先把僧人喊醒，袈裟却已不在原处。', { relations: { 玄奘: 1, 金池: -2 }, flags: { robeChoice: 'cautious' }, routes: { insight: 2 }, feedback: '金池长老记恨你当众扫了他的兴' }),
      choice('show-the-robe', '允他一观', 'mercy', '答应金池只看一眼，让师父把锦襕袈裟在禅房里展开。', '火势过去之后，禅房里只剩焦木。锦襕袈裟已经不在，屋顶上还留着一缕黑风。', { relations: { 玄奘: 2, 金池: 1 }, flags: { robeChoice: 'shown' }, routes: { bond: 2 }, feedback: '玄奘感激你没有让他当场驳了同门的面子' })
    ]),
    '3:6': Object.freeze([
      choice('fight-for-the-robe', '正面索袈裟', 'resolve', '叫开洞门，与黑熊精对决，不给他办佛衣会的机会。', '枪棒分开时，袈裟仍在他肩上。他退回洞中，嚷着要开佛衣会。这一架没有把宝衣打回来。', { relations: { 妖: -3 }, flags: { blackBearPlan: 'duel' }, routes: { defiance: 2 }, action: 'strike', play: true, speech: '打过了。袈裟还在你肩上，这事没完。', answer: '“打得过我，再来说话。今夜佛衣会，照开。”', reply: '开便开。衣一日不还，俺也去一日不走。' }),
      choice('enter-the-feast', '变化赴会', 'insight', '不叫阵，先变成他的妖友混进洞里，查清袈裟藏处。', '你看清宾客与宝衣位置，没有先把洞门打穿。黑熊精还在张罗佛衣会，破绽已经留下。', { relations: { 妖: -1 }, flags: { blackBearPlan: 'infiltrated' }, routes: { insight: 3 } }),
      choice('ask-for-guanyin', '请观音收伏', 'mercy', '收住棒，去南海说明原委，请观音既取回袈裟也给黑熊一条归正之路。', '你没有把这一夜打成打死妖王。观音后来给黑熊戴上禁箍守山，袈裟归还师父。', { relations: { 观音: 2, 妖: 1 }, flags: { blackBearPlan: 'redeemed' }, routes: { bond: 2, discipline: 1 }, feedback: '观音认可你愿意求助而非逞强' })
    ]),
    '3:7': Object.freeze([
      choice('expose-the-disguise', '当场现形', 'resolve', '从高小姐房中现出本相，逼猪刚鬣一路打回云栈洞。', '八戒吃足惊吓才肯说出观音戒行，初见从一场狠斗开始。', { relations: { 八戒: -2 }, flags: { bajieMeeting: 'fought' }, routes: { defiance: 2 }, feedback: '八戒对你的好感下降', action: 'strike' }),
      choice('hear-his-story', '先听来历', 'insight', '变化套话，问清天蓬被贬、错投猪胎与等候取经之事。', '悟空先确认观音安排，再带八戒去见玄奘，少了一分误杀可能。', { relations: { 八戒: 2 }, flags: { bajieMeeting: 'heard' }, routes: { insight: 2 }, feedback: '八戒觉得你并非只会动棒' }),
      choice('protect-the-family', '先安高家', 'mercy', '让八戒答应不再强留高小姐，也替高家归还被占财物。', '降魔变成一场清账，八戒虽不情愿，仍开始为旧事负责。', { relations: { 八戒: 3, 玄奘: 1 }, flags: { bajieMeeting: 'repaired' }, routes: { bond: 3 }, feedback: '八戒对你的好感上升' })
    ]),
    '3:8': Object.freeze([
      choice('welcome-the-junior', '认下师弟', 'mercy', '悟空主动替八戒背起一段行李，带他进入队伍。', '一句“师弟”让高老庄的旧妖真正有了同行位置。', { relations: { 八戒: 4, 玄奘: 1 }, flags: { bajieJoined: 'welcomed' }, routes: { bond: 3 }, feedback: '八戒开始真正把你当作师兄' }),
      choice('set-three-rules', '先立三戒', 'resolve', '约定不许欺民、掳人、临阵弃师，再许八戒同行。', '八戒嘴上抱怨，队伍却从一开始便有清楚界线。', { relations: { 八戒: 1, 玄奘: 2 }, flags: { bajieJoined: 'rules' }, routes: { discipline: 3 } }),
      choice('watch-in-silence', '沉默观察', 'insight', '不急着亲近，只看八戒是否真肯挑担上路。', '八戒感到被怀疑，仍用一路脚印证明自己没有回云栈洞。', { relations: { 八戒: -1 }, flags: { bajieJoined: 'watched' }, routes: { insight: 2 }, feedback: '八戒不喜欢你的冷眼旁观' })
    ]),
    '4:0': Object.freeze([
      choice('yellow-wind-face', '迎风追妖', 'resolve', '顶着黄风追入岭中，以金箍棒逼黄风怪现出洞门。', '悟空硬闯风口救出一队山民，却被神风伤了双眼，只得暂退。', { relations: { 玄奘: 1, 灵吉: -1 }, flags: { yellowWindPlan: 'force' }, routes: { defiance: 3 }, action: 'strike', feedback: '玄奘担忧你的伤势，灵吉认为你行事太急' }),
      choice('yellow-wind-seek', '寻灵吉定风', 'insight', '循土地所言先访灵吉，问清黄风怪与三昧神风的根脚。', '飞龙宝杖先定住神风，黄毛貂鼠无处借势，救师少了一场盲斗。', { relations: { 灵吉: 3, 玄奘: 1 }, flags: { yellowWindPlan: 'lingji' }, routes: { insight: 3, discipline: 1 }, action: 'consider', feedback: '灵吉菩萨认可你先辨根脚' }),
      choice('yellow-wind-guard', '先护同行', 'mercy', '让八戒守住玄奘留下的行囊，自己引开卷向村落的恶风。', '村落免遭风灾，救师稍迟半刻，师兄弟却第一次分工应难。', { relations: { 八戒: 2, 玄奘: 2 }, flags: { yellowWindPlan: 'protect' }, routes: { bond: 3 }, action: 'guard', feedback: '八戒愿意与你分担救师之责' })
    ]),
    '4:1': Object.freeze([
      choice('sand-river-duel', '守岸封河', 'resolve', '让八戒分水入河，自己提棒守住岸口，准备把流沙河妖逼离深水。', '两人在浑水中鏖战多时，悟空牢牢守住退路，水妖也把他当成了此战真正的主将。', { relations: { 悟净: -2, 八戒: 1 }, flags: { sandRiverMethod: 'duel' }, routes: { defiance: 2 }, action: 'strike', feedback: '悟净把你视作强敌' }),
      choice('sand-river-lure', '引妖离水', 'insight', '暗示八戒佯败，自己在浅滩布下毫毛，封住水妖退回深水的去路。', '水妖在岸边失去水势，颈下九颗骷髅也露出取经因缘。', { relations: { 悟净: 1, 八戒: 2 }, flags: { sandRiverMethod: 'lured' }, routes: { insight: 3 }, action: 'consider', feedback: '八戒认可你布下的岸上后手' }),
      choice('sand-river-question', '问明项下骷髅', 'mercy', '叫住八戒的钉耙，隔着水势问那九颗浮水骷髅从何而来。', '水妖第一次说起飞剑穿胸的刑罚与等候取经人的旧约，杀意稍退。', { relations: { 悟净: 3, 玄奘: 1 }, flags: { sandRiverMethod: 'heard' }, routes: { bond: 3, insight: 1 }, feedback: '悟净因你肯听来历而放下戒心' }),
      choice('sand-river-silent', '沉默守岸', 'insight', '不与水妖互骂，只横棒守住河岸，等他先说出观音名号。', '沉默拖慢了战局，也让一声“取经人”终于穿过水响。', { relations: { 悟净: 1, 八戒: -1 }, flags: { sandRiverMethod: 'silent' }, routes: { discipline: 2 }, action: 'guard', feedback: '八戒不明白你为何忽然收手' })
    ]),
    '4:2': Object.freeze([
      choice('welcome-wujing', '扶起悟净', 'mercy', '收起金箍棒，亲手扶起受戒后的悟净，把经担旁的位置让给新师弟。', '流沙河妖从这一扶起有了新名与同行位置，默默接过最重的行李。', { relations: { 悟净: 4, 玄奘: 2 }, flags: { wujingWelcome: 'embraced' }, routes: { bond: 3 }, action: 'guard', feedback: '悟净把你这一扶牢牢记下' }),
      choice('charge-wujing', '先问旧罪', 'resolve', '先问清九个取经人命丧流沙河之事，再许他皈依。', '悟净不回避旧罪，立誓以余生护送这一次西行；队伍从坦白中立下界线。', { relations: { 悟净: 2, 玄奘: 2 }, flags: { wujingWelcome: 'accounted' }, routes: { discipline: 3, insight: 1 } }),
      choice('observe-wujing', '看他如何挑担', 'insight', '不急着说宽恕，让悟净先将河中遗物收殓，再挑担上路。', '悟净以行动回答来意，沉稳成为师徒四人最早看见的品性。', { relations: { 悟净: 3 }, flags: { wujingWelcome: 'proved' }, routes: { insight: 2, discipline: 1 }, feedback: '悟净认可你以行动验心' })
    ]),
    '4:3': Object.freeze([
      choice('trial-heart-confess', '替八戒坦白', 'mercy', '试心揭破后，不把八戒独自留在树上受笑，替他说出一路劳苦与软弱。', '八戒仍受了教训，却没有被师门当成一个只配取笑的错处。', { relations: { 八戒: 4, 玄奘: 1, 观音: 1 }, flags: { trialHeart: 'protected' }, routes: { bond: 3 }, action: 'guard', feedback: '八戒感激你没有趁机奚落' }),
      choice('trial-heart-rebuke', '当面申戒', 'resolve', '指出八戒见富贵便忘取经誓愿，要求他亲口认错。', '八戒羞恼，却从此知道临阵散伙不是一句玩笑就能揭过。', { relations: { 八戒: -2, 玄奘: 2 }, flags: { trialHeart: 'rebuked' }, routes: { discipline: 3 }, action: 'advance', feedback: '八戒不满你的严厉，玄奘认可你守住戒线' }),
      choice('trial-heart-read', '识破幻宅', 'insight', '从荒山突然出现的华宅与母女来历中察觉试探，暗示众人收心。', '悟空没有提前拆穿四圣，却让玄奘与悟净稳稳通过，八戒也少出一重丑态。', { relations: { 观音: 2, 八戒: 1 }, flags: { trialHeart: 'recognized' }, routes: { insight: 3 } }),
      choice('trial-heart-silent', '沉默不语', 'insight', '看见八戒追入后堂也不出声，只等幻境自行收束。', '八戒把这份沉默当作旁观，往后几日都避开悟空的目光。', { relations: { 八戒: -3 }, flags: { trialHeart: 'silent' }, routes: { insight: 1 }, action: 'listen', feedback: '八戒认为你故意看他出丑' })
    ]),
    '4:4': Object.freeze([
      choice('fruit-ask', '依礼求果', 'mercy', '先向清风明月说明师父不识仙果，请他们再取一枚当面解释。', '童子虽不肯多给，却答应替玄奘剖明果形；冲突没有立刻变成偷窃。', { relations: { 镇元: 2, 玄奘: 2 }, flags: { wuzhuangFruitMethod: 'asked' }, routes: { bond: 2, discipline: 1 }, feedback: '五庄观记下了你的礼数' }),
      choice('fruit-steal', '摘果同分', 'resolve', '以金击子摘下人参果，与八戒、悟净背着师父分食。', '三人尝到仙果，也把一桩嘴馋写成欺瞒；落地消失的一枚更引来争执。', { relations: { 玄奘: -3, 镇元: -3, 八戒: 2, 悟净: -1 }, flags: { wuzhuangFruitMethod: 'stole' }, routes: { defiance: 3 }, feedback: '玄奘不认同你的欺瞒，镇元大仙的好感下降' }),
      choice('fruit-count', '查清果数', 'insight', '先用土地之法查出果落即入土，再与童子核对枝上数目。', '悟空看清失果的缘由，也留下可供对质的证据，仍未能压住清风明月的辱骂。', { relations: { 镇元: 1, 悟净: 1 }, flags: { wuzhuangFruitMethod: 'measured' }, routes: { insight: 3 } }),
      choice('fruit-silent', '沉默不认', 'insight', '面对童子质问不承认也不争辩，把果核悄悄收起。', '沉默让猜疑更深，玄奘无法替徒弟说情，五庄观的门也随之关紧。', { relations: { 玄奘: -2, 镇元: -2 }, flags: { wuzhuangFruitMethod: 'silent' }, routes: { discipline: 1, insight: 1 }, feedback: '玄奘无法理解你的隐瞒' })
    ]),
    '4:5': Object.freeze([
      choice('tree-rage', '怒推灵根', 'resolve', '受不得童子辱骂，拔毫毛定住众人，一棒推倒人参果树。', '灵根断倒，仙果入土；一场口角变成必须遍访三岛才能偿还的大祸。', { relations: { 镇元: -5, 玄奘: -3 }, flags: { ginsengTreeResponse: 'felled' }, routes: { defiance: 4 }, action: 'strike', feedback: '镇元大仙震怒，玄奘不认同你以毁树泄愤' }),
      choice('tree-own', '认错护众', 'mercy', '承认摘果由自己起头，请镇元只拘自己，不牵连师父师弟。', '镇元仍锁住师徒，却把救树之责交给悟空；众人免去一轮鞭打。', { relations: { 镇元: 2, 玄奘: 3, 八戒: 2, 悟净: 2 }, flags: { ginsengTreeResponse: 'owned' }, routes: { bond: 3, discipline: 2 }, action: 'bow', feedback: '玄奘与师弟认可你独自担责' }),
      choice('tree-bargain', '立限救树', 'insight', '指出仙根未绝，提出三日为限寻方，若救不活再受处置。', '镇元验过树脉后准他出门求方，冲突被改成一份有期限的承诺。', { relations: { 镇元: 2, 玄奘: 1 }, flags: { ginsengTreeResponse: 'bargained' }, routes: { insight: 3, discipline: 1 }, feedback: '镇元大仙认可你没有逃避后果' })
    ]),
    '4:6': Object.freeze([
      choice('remedy-beg', '低首求甘露', 'mercy', '遍访三岛无方后向观音坦陈毁树始末，请她以甘露相救。', '悟空没有遮掩自己的过错；甘露落下，镇元也愿与他结为兄弟。', { relations: { 观音: 3, 镇元: 4, 玄奘: 2 }, flags: { wuzhuangRemedy: 'humbled' }, routes: { bond: 3, discipline: 2 }, action: 'bow', feedback: '观音与镇元都认可你肯为过错低头' }),
      choice('remedy-demand', '催仙家出手', 'resolve', '以取经大事催促三岛仙翁与观音立即救树。', '树虽被救活，众仙却认为悟空只看见行程，不肯看清自己欠下的因果。', { relations: { 观音: -2, 镇元: -2, 寿星: -2 }, flags: { wuzhuangRemedy: 'demanded' }, routes: { defiance: 3 }, action: 'advance', feedback: '观音与寿星不认同你的催逼' }),
      choice('remedy-study', '共验灵根', 'insight', '请福禄寿三星查树脉、观音验甘露，自己记下仙根离土后的生机。', '救树不只是一道神通，也成为众仙合力补回因果的过程。', { relations: { 观音: 2, 镇元: 3, 寿星: 3 }, flags: { wuzhuangRemedy: 'studied' }, routes: { insight: 3 }, action: 'consider', feedback: '南极寿星认可你认真求方' }),
      choice('remedy-silent', '守树候雨', 'insight', '求遍三岛后不再辩解，只守在倒树旁等观音到来。', '镇元从这场沉默里看见悔意，却也等不到一句明确的道歉。', { relations: { 镇元: 1, 观音: 1 }, flags: { wuzhuangRemedy: 'silent' }, routes: { discipline: 2 }, action: 'listen' })
    ]),
    '4:7': Object.freeze([
      choice('bone-strike-swift', '见妖即打', 'resolve', '火眼一见妖气便举棒，不向玄奘解释三次变化的破绽。', '白骨精被当场打死，玄奘眼中却只剩三具凡人假身与徒弟不肯说明的杀意。', { relations: { 白骨: -5, 玄奘: -4, 八戒: -1 }, flags: { whiteBoneMethod: 'swift' }, routes: { defiance: 4 }, action: 'strike', feedback: '玄奘认定你滥杀无辜' }),
      choice('bone-reveal', '逐变验真', 'insight', '每次先指出饭食、脚印与魂魄的破绽，再逼白骨精脱壳。', '妖精仍死在棒下，但三次证据留在众人眼前，玄奘的怀疑没有完全压过事实。', { relations: { 玄奘: 2, 八戒: 1, 白骨: -4 }, flags: { whiteBoneMethod: 'proved' }, routes: { insight: 4, discipline: 1 }, action: 'consider', feedback: '玄奘开始相信你的火眼判断' }),
      choice('bone-capture', '留魂对质', 'mercy', '以毫毛缚住遁出的白骨妖魂，不急着打散，带到玄奘面前对质。', '真形现于师徒之间，白骨岭少了一场误认；悟空也把杀妖改成先证其罪。', { relations: { 玄奘: 4, 观音: 1, 白骨: -2 }, flags: { whiteBoneMethod: 'captured' }, routes: { bond: 3, discipline: 2 }, action: 'guard', feedback: '玄奘认可你先证明再处置' }),
      choice('bone-silent', '沉默收棒', 'insight', '第三次见到妖气时没有出手，只护着玄奘后退。', '白骨精抓住迟疑再度扑来，八戒受伤，悟空才将其打死；沉默没有换来信任。', { relations: { 玄奘: -1, 八戒: -3, 白骨: -4 }, flags: { whiteBoneMethod: 'hesitated' }, routes: { discipline: 2 }, action: 'guard', feedback: '八戒因你的迟疑受伤，玄奘仍未看懂真相' })
    ]),
    '4:8': Object.freeze([
      choice('exile-kneel', '留书再拜', 'mercy', '接下贬书，不再争辩，向玄奘叩首后把救命毫毛留在他手中。', '悟空回了花果山，却把“有难仍来”的承诺留在师父身边。', { relations: { 玄奘: 2, 八戒: 1 }, flags: { exileResponse: 'left-help' }, routes: { bond: 3, discipline: 1 }, action: 'bow', feedback: '玄奘没有挽留，却收下了你的救命毫毛' }),
      choice('exile-break', '怒断师门', 'resolve', '在咒痛中撕去贬书，直言从此各走一方。', '悟空带着怒意回山，玄奘也把这次离别当成无法轻易挽回的决裂。', { relations: { 玄奘: -5, 八戒: -2 }, flags: { exileResponse: 'severed' }, routes: { defiance: 4 }, action: 'withdraw', feedback: '玄奘与你的关系大幅下降' }),
      choice('exile-ask', '问清逐走之因', 'insight', '要求玄奘逐条说明，是因杀生、欺瞒还是不信火眼，听完再走。', '师徒第一次把争执拆开来说，仍旧分离，却各自带走了对方真正介意的事。', { relations: { 玄奘: 1, 八戒: 1 }, flags: { exileResponse: 'questioned' }, routes: { insight: 3 }, action: 'consider' }),
      choice('exile-silent', '沉默离去', 'insight', '收起金箍棒，一句话也不留，翻筋斗消失在白骨岭上。', '玄奘将沉默当成不服，悟空则把未说的话带回水帘洞，裂痕继续扩大。', { relations: { 玄奘: -3, 八戒: -1 }, flags: { exileResponse: 'silent' }, routes: { discipline: 2, insight: 1 }, action: 'withdraw', feedback: '玄奘无法确认你是否还会回来' })
    ]),
    '5:0': Object.freeze([]),
    '5:1': Object.freeze([
      choice('return-for-master', '为师回程', 'mercy', '听见玄奘变虎便立刻收拾行装，不计八戒激将中的难听话。', '悟空回到宝象国先救师父，旧怨没有消失，却被一次主动回头压住。', { relations: { 玄奘: 4, 八戒: 3, 悟净: 2 }, flags: { returnAfterExile: 'forgiven' }, routes: { bond: 4 }, action: 'guard', feedback: '师徒三人因你回头而重新靠近' }),
      choice('return-for-name', '拆穿八戒激将', 'insight', '识破八戒所说黄袍怪辱骂齐天大圣是激将，仍决定回去，但要他承认真情。', '八戒说出师父遇难与悟净重伤，悟空因真话回程，不让虚名替自己作主。', { relations: { 八戒: 2, 玄奘: 2 }, flags: { returnAfterExile: 'truth' }, routes: { insight: 3, bond: 1 }, feedback: '八戒认可你听得进真话' }),
      choice('return-demand', '先要师父认错', 'resolve', '要求八戒带回玄奘亲口的认错话，否则不出花果山。', '救援因此迟了一程，悟净伤势更重；玄奘最终道歉，却记住这场交换。', { relations: { 玄奘: -2, 八戒: -2, 悟净: -2 }, flags: { returnAfterExile: 'conditioned' }, routes: { defiance: 3 }, feedback: '悟净因救援迟来而受伤，玄奘不认同你的条件' }),
      choice('return-silent', '沉默披甲', 'insight', '不答八戒，只取下金箍棒与虎皮裙，率群猴让开山门。', '八戒从动作里得到答案，悟空却把是否原谅留到救师之后。', { relations: { 八戒: 1, 群猴: 1 }, flags: { returnAfterExile: 'silent' }, routes: { discipline: 2 }, action: 'advance' })
    ]),
    '5:2': Object.freeze([
      choice('lotus-outwit', '连环换宝', 'insight', '以毫毛、假葫芦和调虎离山之计逐件换走五件法宝。', '金角银角的口诀与底牌都被悟空倒过来利用，师徒少受一轮宝物之困。', { relations: { 八戒: 2, 妖: -3 }, flags: { lotusCavePlan: 'outwitted' }, routes: { insight: 4 }, action: 'consider', feedback: '八戒佩服你的连环变化' }),
      choice('lotus-break', '迎宝硬闯', 'resolve', '不再变化周旋，先以分身塞满葫芦，再挥棒破开莲花洞。', '洞门被强行打穿，妖兵四散，悟空也险些被净瓶再度吸入。', { relations: { 妖: -4, 玄奘: -1 }, flags: { lotusCavePlan: 'stormed' }, routes: { defiance: 3 }, action: 'strike' }),
      choice('lotus-spare', '留二魔归主', 'mercy', '识出金角银角是老君童子后收棒，要求老君亲自说明纵童下界之责。', '二魔被收回兜率宫，悟空没有杀尽，天上主人也不能只把过错推给坐骑童子。', { relations: { 老君: 2, 玄奘: 2, 妖: 1 }, flags: { lotusCavePlan: 'returned' }, routes: { bond: 2, discipline: 2 }, feedback: '玄奘认可你追问主人之责' })
    ]),
    '5:3': Object.freeze([
      choice('wuji-vow', '接下王命', 'mercy', '当场接下冤死国王的请托，再请玄奘安抚不敢相信父王已死的太子。', '一纸托梦变成师徒共同承担的冤案，太子愿意暗中相助。', { relations: { 玄奘: 3 }, flags: { wujiPromise: 'accepted' }, routes: { bond: 3 }, feedback: '玄奘认可你把昭雪冤案写进取经之路' }),
      choice('wuji-test', '先验井中尸身', 'insight', '亲自入井寻尸，再让八戒取来太子信物，待证据齐全才惊动王宫。', '国王尸身与井龙证词互相印证，妖道再难把托梦说成妄言。', { relations: { 玄奘: 2, 八戒: 1 }, flags: { wujiPromise: 'verified' }, routes: { insight: 3, discipline: 1 } }),
      choice('wuji-refuse', '只顾西行', 'resolve', '主张国事不该耽误取经，不愿为王宫冤案停下西行脚步。', '冤魂长跪不去，玄奘坚持先听完冤情；师徒对“西行所为何人”生出争执。', { relations: { 玄奘: -3, 八戒: -1 }, flags: { wujiPromise: 'refused' }, routes: { discipline: 2, defiance: 1 }, feedback: '玄奘不认同你把眼前冤情留在身后' }),
      choice('wuji-silent', '沉默听冤', 'insight', '不立即许诺，只抱棒听国王把三年冤情说完。', '沉默让冤魂说尽细节，却也令他不知你是否愿意伸手。', { relations: { 玄奘: 1 }, flags: { wujiPromise: 'silent' }, routes: { insight: 2 }, action: 'listen' })
    ]),
    '5:4': Object.freeze([
      choice('redboy-doubt', '先验孩童', 'insight', '看见山野无脚印、绳结却带火气，先用火眼察看哭声来处。', '红孩儿的变化被提前识出，未能直接背走玄奘，只得现身邀战。', { relations: { 玄奘: 2, 红孩: -2 }, flags: { redBoySuspicion: 'proved' }, routes: { insight: 4 }, action: 'consider', feedback: '玄奘认可你用证据说明疑点' }),
      choice('redboy-rescue', '依师命救童', 'mercy', '明知可疑仍依玄奘慈念放下兵器，亲自解开绳索。', '孩童突然吐火掳走玄奘；善意被利用，却没有让师徒否定救人的本心。', { relations: { 玄奘: 3, 红孩: -1 }, flags: { redBoySuspicion: 'trusted' }, routes: { bond: 3 }, action: 'guard', feedback: '玄奘认可你愿意尊重他的慈悲判断' }),
      choice('redboy-strike', '隔空打散', 'resolve', '不等哭声说完便挥棒打向幻身，逼藏在风中的红孩儿现形。', '玄奘没有被掳，山中真正迷路的樵童却被棒风惊伤，师父因此震怒。', { relations: { 玄奘: -4, 红孩: -3 }, flags: { redBoySuspicion: 'struck' }, routes: { defiance: 3 }, action: 'strike', feedback: '玄奘不认同你在未辨清前出手' }),
      choice('redboy-silent', '沉默让路', 'insight', '不说可疑之处，只侧身让玄奘自行决定。', '玄奘上前解绳后被风卷走，悟空的沉默也被师弟视为赌气。', { relations: { 玄奘: -2, 八戒: -2 }, flags: { redBoySuspicion: 'silent' }, routes: { discipline: 2 }, action: 'listen', feedback: '八戒认为你明知有诈却不提醒' })
    ]),
    '5:5': Object.freeze([
      choice('samadhi-charge', '闭烟闯火', 'resolve', '念避火诀冲进三昧火阵，直取红孩儿的丈八火尖枪。', '悟空逼近洞门，却被倒卷的烟火熏昏，救师不得不改请观音。', { relations: { 红孩: -3, 八戒: 1 }, flags: { samadhiResponse: 'charged' }, routes: { defiance: 3 }, action: 'strike', play: true }),
      choice('samadhi-study', '辨三昧火眼', 'insight', '从火随鼻息而发、龙王雨水反助火势看出它不是凡火。', '悟空及时止住四海降雨，保住山林，转而去请能制心火的观音。', { relations: { 观音: 2, 红孩: 1 }, flags: { samadhiResponse: 'understood' }, routes: { insight: 4 }, action: 'consider', feedback: '观音认可你看清三昧火的根性' }),
      choice('samadhi-cover', '先撤山民', 'mercy', '让八戒与土地疏散火云洞下的山民，自己断后挡住火线。', '救师慢了一步，火势却没有吞过山谷；悟空带着灼伤去南海求援。', { relations: { 八戒: 3, 玄奘: 1 }, flags: { samadhiResponse: 'protected' }, routes: { bond: 3, discipline: 1 }, action: 'guard', feedback: '八戒认可你没有只顾斗胜' })
    ]),
    '5:6': Object.freeze([
      choice('redboy-submit', '劝其自降', 'mercy', '在观音落下天罡刀前，再给红孩儿一次放回玄奘、自己受戒的机会。', '红孩儿虽不甘，终在莲台上收火；善财之路从一次主动低头开始。', { relations: { 红孩: 3, 观音: 3, 玄奘: 2 }, flags: { redBoyEnding: 'consented' }, routes: { bond: 4, discipline: 1 }, feedback: '红孩儿记住你给过他选择' }),
      choice('redboy-bind', '请观音严收', 'resolve', '要求观音立刻以金箍与天罡刀制住红孩儿，不再给他吐火的空隙。', '红孩儿被强行收为善财童子，玄奘得救，他却把这份屈服记在心底。', { relations: { 红孩: -4, 观音: 1 }, flags: { redBoyEnding: 'bound' }, routes: { discipline: 3, defiance: 1 }, action: 'guard', feedback: '红孩儿对你的敌意大幅上升' }),
      choice('redboy-question', '追问父母因果', 'insight', '收伏前先问牛魔王与铁扇公主为何放任幼子占山食人。', '红孩儿的恶行没有被身世开脱，火焰山一家与悟空的旧账却提前浮出水面。', { relations: { 红孩: 1, 牛魔: -1, 铁扇: -1, 观音: 2 }, flags: { redBoyEnding: 'accounted' }, routes: { insight: 3 }, feedback: '牛魔王与铁扇公主不满你追问家门之责' }),
      choice('redboy-silent-end', '沉默看他受戒', 'insight', '收棒立在莲台旁一言不发，只看火焰在红孩儿一步一拜中熄灭。', '红孩儿不知道这份沉默是怜悯还是冷眼，日后再见仍有一层隔膜。', { relations: { 红孩: -1 }, flags: { redBoyEnding: 'silent' }, routes: { insight: 2 }, action: 'listen' })
    ]),
    '5:7': Object.freeze([
      choice('blackriver-call', '持帖请摩昂', 'insight', '从鼍龙口音与水府旗号辨出西海来历，持龙王书帖请摩昂太子。', '水族家事由西海亲自收束，悟空少毁一座水府，也救回玄奘。', { relations: { 龙王: 3, 白龙: 2, 玄奘: 1 }, flags: { blackRiverMethod: 'appealed' }, routes: { insight: 3, discipline: 1 }, feedback: '西海龙族认可你依理求援' }),
      choice('blackriver-smash', '掀翻水府', 'resolve', '变作水族潜入河底，挥棒砸开席宴与牢门。', '玄奘被直接抢回，鼍龙也负伤逃向西海；龙族对这场越境问罪颇有微词。', { relations: { 龙王: -3, 玄奘: 2 }, flags: { blackRiverMethod: 'stormed' }, routes: { defiance: 3 }, action: 'strike', feedback: '龙族不认同你掀翻水府' }),
      choice('blackriver-save', '先救同席僧人', 'mercy', '入水府后先放走一并被掳的河岸僧人与渔户，再寻玄奘。', '鼍龙警觉逃遁，玄奘仍被救出，水府中无名囚徒也得以归家。', { relations: { 玄奘: 3, 悟净: 2 }, flags: { blackRiverMethod: 'rescued-all' }, routes: { bond: 3 }, action: 'guard', feedback: '玄奘认可你没有只救师父一人' })
    ]),
    '5:8': Object.freeze([
      choice('chechi-public', '公开三场斗法', 'resolve', '应下求雨、坐禅与隔板猜物，让三妖在满城百姓前显出邪术破绽。', '国师威名当众崩塌，受压僧人获释，斗法也一步步走向生死赌局。', { relations: { 玄奘: 1, 妖: -4 }, flags: { chechiMethod: 'public' }, routes: { defiance: 3 }, action: 'advance' }),
      choice('chechi-free-monks', '先解僧役', 'mercy', '先以毫毛替苦役僧人完成徭役，再逼国王审问三妖为何压佛。', '僧众当夜脱困，悟空也得到他们提供的符箓与祭坛线索。', { relations: { 玄奘: 3, 悟净: 2 }, flags: { chechiMethod: 'liberated' }, routes: { bond: 3 }, action: 'guard', feedback: '受难僧众与玄奘都认可你先救人' }),
      choice('chechi-unmask', '暗查五雷法', 'insight', '潜入三清殿查明令牌、符水与天神应召的规矩，再决定如何斗法。', '悟空先断三妖冒领天功的凭据，使国王第一次怀疑国师的神通。', { relations: { 玄奘: 2, 妖: -2 }, flags: { chechiMethod: 'exposed' }, routes: { insight: 4 }, action: 'consider' }),
      choice('chechi-silent', '沉默受讥', 'insight', '面对三妖辱骂不立刻反击，只将受难僧人的锁链放到御前。', '一城目光先落在锁链而非口舌上，国王不得不准许公平斗法。', { relations: { 玄奘: 2 }, flags: { chechiMethod: 'evidence' }, routes: { discipline: 2, insight: 1 }, action: 'listen' })
    ]),
    '6:0': Object.freeze([
      choice('chechi-end-kill', '依赌伏邪', 'resolve', '照三妖自定的赌约破鹿力、羊力与虎力之术，不替败者留命。', '三具原形倒在御阶前，邪术尽破，满城也记住了斗法以死亡收尾。', { relations: { 妖: -5, 玄奘: -2 }, flags: { chechiAftermath: 'executed' }, routes: { defiance: 4 }, action: 'strike', feedback: '玄奘不认同把斗法推到死局' }),
      choice('chechi-end-spare', '破术留命', 'mercy', '在三妖现出原形后收住兵器，请国王废其国师位、放归山野受戒。', '被压僧人得释，三妖也失去借王权害人的位置，车迟国没有再添三条性命。', { relations: { 玄奘: 4, 妖: 1 }, flags: { chechiAftermath: 'spared' }, routes: { bond: 3, discipline: 2 }, action: 'guard', feedback: '玄奘认可你破邪而不滥杀' }),
      choice('chechi-end-law', '立下同坛之约', 'insight', '请国王废除独尊国师之令，让僧道各凭戒行而非神术争高。', '车迟国从一场胜负转向一条新法，往后的信仰不再由三场把戏决定。', { relations: { 玄奘: 3 }, flags: { chechiAftermath: 'reformed' }, routes: { insight: 3, discipline: 2 }, action: 'consider' })
    ]),
    '6:1': Object.freeze([
      choice('tongtian-disguise', '替童入庙', 'resolve', '悟空与八戒变作童男童女坐上祭盘，等灵感大王现身便迎头出手。', '两个真孩子留在父母身边，妖王也在祭庙里撞上早已备好的钉耙与铁棒。', { relations: { 八戒: 2, 玄奘: 2 }, flags: { tongtianChildren: 'replaced' }, routes: { defiance: 2, bond: 2 }, action: 'guard', feedback: '陈家庄与玄奘都感念你们替童赴险' }),
      choice('tongtian-evacuate', '连夜送童离庄', 'mercy', '先护送童男童女与历年祭祀家属离开河岸，再回来断妖王香火。', '灵感大王扑了空，转而掀浪淹庄；师徒救下孩子，也必须面对更大的水患。', { relations: { 玄奘: 3, 悟净: 2 }, flags: { tongtianChildren: 'evacuated' }, routes: { bond: 4 }, action: 'guard', feedback: '玄奘认可你先保住孩子' }),
      choice('tongtian-ledger', '查历年祭册', 'insight', '翻查陈家庄祭册与河中鳞片，确认妖王每年索童的时辰和水路。', '祭祀不再只是乡民传言，十二年受害名册成为请观音问责的证据。', { relations: { 观音: 2, 玄奘: 2 }, flags: { tongtianChildren: 'documented' }, routes: { insight: 3, discipline: 1 }, action: 'consider' }),
      choice('tongtian-silent', '沉默坐上祭盘', 'insight', '不向孩子解释，只让他们回家，自己变作童子坐上红盘。', '孩子记住陌生行者替自己赴险的背影，八戒却担心师兄又独自揽下杀局。', { relations: { 八戒: 1, 玄奘: 2 }, flags: { tongtianChildren: 'silent-sacrifice' }, routes: { discipline: 3 }, action: 'listen' })
    ]),
    '6:2': Object.freeze([
      choice('fish-return', '请观音收回金鱼', 'mercy', '见鱼篮照出真身后收棒，请观音带回莲池并向陈家庄说明失察。', '灵感大王不再吃童，观音也亲自听见十二年祭册上的名字。', { relations: { 观音: 3, 玄奘: 3, 老鼋: 1 }, flags: { inspirationEnding: 'returned', turtlePromise: 'asked' }, routes: { bond: 3, discipline: 2 }, feedback: '观音认可你既留生路也追问失察' }),
      choice('fish-punish', '先问十二年罪', 'resolve', '拦在鱼篮前，要求灵感大王为历年童祭受审后再归莲池。', '妖王被迫听完受害家属证词，观音虽准问责，也不满悟空阻她收鱼。', { relations: { 观音: -1, 玄奘: 2, 老鼋: 2 }, flags: { inspirationEnding: 'judged', turtlePromise: 'asked' }, routes: { defiance: 3, discipline: 1 }, action: 'advance', feedback: '观音不满你拦篮，陈家庄认可你追问旧罪' }),
      choice('fish-trace', '辨莲池金鳞', 'insight', '从鳞片与潮音辨出普陀莲池气息，先问观音金鱼何时走失。', '妖王根脚与失察年月相互印证，通天河的灾祸有了完整来处。', { relations: { 观音: 2, 老鼋: 2 }, flags: { inspirationEnding: 'traced', turtlePromise: 'recorded' }, routes: { insight: 4 }, action: 'consider', feedback: '老鼋请你把寿数之问也一并记下' })
    ]),
    '6:3': Object.freeze([
      choice('golden-ring-summon', '遍请天将试宝', 'resolve', '接连请来哪吒、火德星君与众天将，以不同兵器逼金刚琢显出极限。', '诸般神兵尽被套走，青牛威势更盛，悟空却从失宝次序中锁定兜率宫。', { relations: { 哪吒: 2, 老君: -1 }, flags: { goldenRingPlan: 'tested' }, routes: { defiance: 2, insight: 2 }, action: 'strike' }),
      choice('golden-ring-find-owner', '循圈寻主', 'insight', '不再堆叠援兵，查遍天宫谁家少了坐骑与金刚琢。', '兜率宫牛栏的空绳给出答案，老君赶在更多兵器被收前下界。', { relations: { 老君: 2, 玄奘: 1 }, flags: { goldenRingPlan: 'traced' }, routes: { insight: 4 }, action: 'consider', feedback: '太上老君认可你找到了真正根脚' }),
      choice('golden-ring-protect', '空手守洞门', 'mercy', '兵器被收后仍以身挡住洞口，先让被抓的樵夫与僧人撤走。', '悟空吃了几次重击，却让金兜洞中无名俘虏随师父一起获救。', { relations: { 玄奘: 3, 八戒: 2, 悟净: 2 }, flags: { goldenRingPlan: 'shielded' }, routes: { bond: 4 }, action: 'guard', feedback: '同伴认可你失了兵器仍守在前面' })
    ]),
    '6:4': Object.freeze([
      choice('pregnancy-laugh', '拿八戒打趣', 'resolve', '一边赶往解阳山，一边拿八戒腹痛取笑，催他撑住。', '笑声压住慌乱，却让八戒觉得自己的狼狈只是一场热闹。', { relations: { 八戒: -3, 玄奘: -1 }, flags: { pregnancyResponse: 'mocked' }, routes: { defiance: 2 }, feedback: '八戒不满你拿他的痛苦取笑' }),
      choice('pregnancy-care', '照料师父师弟', 'mercy', '先安置玄奘与八戒休息，确认脉象后再独自去取落胎泉。', '两人少受颠簸，悟空也把这场奇难当作真正的身体苦楚，而非笑谈。', { relations: { 八戒: 4, 玄奘: 3 }, flags: { pregnancyResponse: 'cared' }, routes: { bond: 4 }, action: 'guard', feedback: '玄奘与八戒都记住你的细心照料' }),
      choice('pregnancy-bargain', '以旧缘换泉', 'insight', '查清如意真仙与牛魔王的亲缘，先谈红孩儿归观音门下后的安稳，再求泉水。', '如意真仙虽有怨，仍开泉救人；火焰山旧账没有再添一场死斗。', { relations: { 牛魔: 1, 铁扇: 1, 八戒: 2 }, flags: { pregnancyResponse: 'negotiated' }, routes: { insight: 3, bond: 1 }, action: 'consider' }),
      choice('pregnancy-silent', '沉默取水', 'insight', '不接众人的玩笑，提壶独自赶往解阳山。', '泉水及时取回，八戒从这份沉默里看出师兄其实认真担忧。', { relations: { 八戒: 2 }, flags: { pregnancyResponse: 'silent-care' }, routes: { discipline: 2 }, action: 'listen' })
    ]),
    '6:5': Object.freeze([
      choice('daughter-honest', '劝师父坦言', 'mercy', '请玄奘亲口感谢女王真心，也说明取经誓愿与不能许诺的归期。', '关文获准，告别没有被说成权宜骗局；女王虽痛，仍亲自送到城门。', { relations: { 女王: 4, 玄奘: 3 }, flags: { daughterFarewell: 'honest' }, routes: { bond: 3, discipline: 2 }, action: 'bow', feedback: '女王因你没有轻慢她的真心而保留敬意' }),
      choice('daughter-feint', '设局取得关文', 'insight', '劝玄奘暂口称愿意，待倒换关文后再借蝎子精风波脱身。', '西行没有停下，女王却在城门才明白承诺只是计策，真心由此生隙。', { relations: { 女王: -4, 玄奘: -2 }, flags: { daughterFarewell: 'deceived' }, routes: { insight: 2, defiance: 1 }, feedback: '女王将这场欺瞒记在了你的身上' }),
      choice('daughter-remain-night', '请留一夜讲经', 'mercy', '提议不应婚事，却留一夜为女儿国讲经，并让女王亲自决定是否放行。', '城中百姓听见西行之愿，女王在天明后开关，离别多了一份彼此理解。', { relations: { 女王: 3, 玄奘: 2 }, flags: { daughterFarewell: 'dharma' }, routes: { bond: 3, insight: 1 }, feedback: '女王认可你没有把一国真心只当成关文' }),
      choice('daughter-silent', '沉默护送告别', 'insight', '不替玄奘说愿或不愿，只护在一旁，等师父将凤冠放回案上。', '女王从动作里读懂拒绝，却无法知道你是否认真看见这场告别。', { relations: { 女王: -2, 玄奘: 1 }, flags: { daughterFarewell: 'silent' }, routes: { discipline: 3 }, action: 'listen', feedback: '女王因你的旁观留下遗憾' })
    ]),
    '6:6': Object.freeze([
      choice('scorpion-endure', '带伤缠斗', 'resolve', '悟空忍住倒马毒刺继续压住洞门，让八戒先救玄奘。', '毒痛几乎使他握不住棒，却给师弟争出救人的时机。', { relations: { 玄奘: 3, 八戒: 3 }, flags: { scorpionPlan: 'endured' }, routes: { defiance: 2, bond: 2 }, action: 'guard', feedback: '八戒认可你负伤仍替他压阵' }),
      choice('scorpion-call-rooster', '辨毒寻昴日', 'insight', '从如来也曾被蜇的旧事与蝎性畏鸡推知昴日星官可制。', '星官一声啼鸣破了毒桩，师徒免去再受第二刺。', { relations: { 玄奘: 2, 观音: 1 }, flags: { scorpionPlan: 'countered' }, routes: { insight: 4 }, action: 'consider' }),
      choice('scorpion-offer-exit', '劝放玄奘', 'mercy', '在请星官前给蝎子精一条放人离山的退路。', '她拒绝交人，仍被星官制伏；玄奘却认可悟空没有因受伤立即报复。', { relations: { 玄奘: 3, 妖: 1 }, flags: { scorpionPlan: 'offered' }, routes: { bond: 3, discipline: 1 }, feedback: '玄奘认可你负伤后仍留退路' })
    ]),
    '6:7': Object.freeze([
      choice('sixear-memories', '以共同记忆辨真', 'mercy', '不比外貌兵器，让师徒分别问一路上只有同行者知道的亏欠与承诺。', '六耳能听万物，却答不出那些从未说出口的照料；真悟空由共同承担被认出。', { relations: { 玄奘: 4, 八戒: 3, 悟净: 3, 六耳: -2 }, flags: { monkeyIdentityProof: 'memories' }, routes: { bond: 4 }, action: 'guard', feedback: '师徒以共同经历认出了你' }),
      choice('sixear-duel', '打到三界皆知', 'resolve', '与六耳从花果山打到地府天宫，让每一位神佛都来判真假。', '两根铁棒一路震动三界，真身仍难辨，旧日齐天威名反而成了双方都能借用的面具。', { relations: { 六耳: -4, 玄奘: -2 }, flags: { monkeyIdentityProof: 'combat' }, routes: { defiance: 4 }, action: 'strike', feedback: '玄奘更难从相同的怒意中辨出你', play: true }),
      choice('sixear-causes', '查旅痕因果', 'insight', '从紧箍反应、师徒关系与每次选择留下的旗标逐一核对。', '假行者复制了形貌与声音，却复制不了一路累积的因果，谛听也因此给出线索。', { relations: { 六耳: -2, 玄奘: 2, 如来: 1 }, flags: { monkeyIdentityProof: 'causes' }, routes: { insight: 4, discipline: 1 }, action: 'consider', feedback: '谛听与玄奘认可因果不会被外形复制' }),
      choice('sixear-silent', '沉默放下棒', 'insight', '在师父面前先放下金箍棒，不再与另一个自己抢着申辩。', '六耳仍高声争真，沉默却让玄奘看见谁愿意先停手，也让悟空承担被误认的风险。', { relations: { 玄奘: 3, 六耳: 1 }, flags: { monkeyIdentityProof: 'restraint' }, routes: { discipline: 4 }, action: 'listen', feedback: '玄奘从你的克制中看见不同' })
    ]),
    '6:8': Object.freeze([
      choice('sixear-kill', '当场打死六耳', 'resolve', '趁如来揭破真身，不给六耳再逃的机会，亲手一棒结束真假之争。', '三界终于只剩一个行者，师徒却必须面对真相为何只能以死亡落定。', { relations: { 六耳: -5, 玄奘: -2, 如来: -1 }, flags: { sixEarEnding: 'killed' }, routes: { defiance: 4 }, action: 'strike', feedback: '玄奘不认同你在真相揭晓后仍下杀手' }),
      choice('sixear-spare', '请留六耳受戒', 'mercy', '收棒请如来留下六耳，让他交还行囊、为冒名与伤人受戒。', '假行者失去冒名的位置，却得到承担旧事的余生；师徒不再靠尸身证明谁真。', { relations: { 六耳: 3, 玄奘: 4, 如来: 2 }, flags: { sixEarEnding: 'spared' }, routes: { bond: 4, discipline: 2 }, action: 'guard', feedback: '玄奘与如来认可你选择止杀' }),
      choice('sixear-ask', '追问为何而生', 'insight', '请如来说明六耳为何偏在师徒裂痕最深时出现。', '答案指向一路未解的不信与怒意；六耳被收伏，真假之争也成为师徒必须面对的镜子。', { relations: { 玄奘: 3, 如来: 3, 六耳: 1 }, flags: { sixEarEnding: 'understood' }, routes: { insight: 4 }, action: 'consider', feedback: '师徒开始正视假行者借以成形的裂痕' }),
      choice('sixear-silent-end', '沉默收回行囊', 'insight', '真相既明，不看六耳，只将散落的经囊重新系好。', '师徒继续上路，生死结局没有被讨论；沉默把问题留到了灵山。', { relations: { 玄奘: 1, 六耳: -1 }, flags: { sixEarEnding: 'silent' }, routes: { discipline: 3 }, action: 'listen' })
    ]),
    '7:0': Object.freeze([
      choice('fan-courtesy', '依礼借扇', 'mercy', '先向铁扇说明取经人、山民与红孩儿近况，以旧交之礼只借三扇。', '铁扇仍因失子含恨，给出假扇试探；悟空却没有先把芭蕉洞变成战场。', { relations: { 铁扇: 2, 红孩: 1, 玄奘: 1 }, flags: { fanApproach: 'courtesy' }, routes: { bond: 3, discipline: 1 }, action: 'bow', feedback: '铁扇公主虽有旧怨，仍记下你的礼数' }),
      choice('fan-force', '闯洞强夺', 'resolve', '认定铁扇不会相借，挥棒打进芭蕉洞，逼她交扇。', '芭蕉扇把悟空扇到小须弥山，旧怨变成明仇，火焰山百姓还要继续等。', { relations: { 铁扇: -5, 牛魔: -2 }, flags: { fanApproach: 'force' }, routes: { defiance: 4 }, action: 'strike', feedback: '铁扇公主与你结下深怨' }),
      choice('fan-offer', '先偿红孩旧账', 'insight', '提出先带铁扇去南海见红孩儿，再谈借扇，让她确认幼子并未受害。', '母子消息被说清，铁扇怒意稍缓，却仍要悟空证明借扇后会如期归还。', { relations: { 铁扇: 4, 红孩: 2, 观音: 1 }, flags: { fanApproach: 'reconcile' }, routes: { insight: 2, bond: 2 }, action: 'consider', feedback: '铁扇公主因红孩儿安稳而稍解旧怨' }),
      choice('fan-silent', '沉默受扇', 'insight', '面对斥责不提旧情，只站在洞外等她先出手。', '铁扇把沉默当成轻慢，一扇更重；悟空也失去说明红孩近况的机会。', { relations: { 铁扇: -3 }, flags: { fanApproach: 'silent' }, routes: { discipline: 2 }, action: 'listen', feedback: '铁扇公主认为你无意解释旧账' })
    ]),
    '7:1': Object.freeze([
      choice('fan-second-disguise', '变作牛魔骗扇', 'insight', '照原计化作牛魔王模样，从铁扇手中骗得真扇。', '真扇到手，夫妻信任却被冒名利用；牛魔也以悟空模样将扇骗回。', { relations: { 铁扇: -4, 牛魔: -3, 六耳: -1 }, flags: { fanSecondPlan: 'disguise' }, routes: { insight: 3, defiance: 1 }, feedback: '铁扇与牛魔都因冒名之计敌意上升' }),
      choice('fan-second-bargain', '以归还立契', 'mercy', '请土地与山民作证，只借扇熄火，事毕亲手送回芭蕉洞。', '铁扇提出牛魔必须同意，借扇之事转成一场可以谈判的家门决断。', { relations: { 铁扇: 3, 牛魔: 1, 玄奘: 2 }, flags: { fanSecondPlan: 'covenant' }, routes: { bond: 3, discipline: 2 }, action: 'bow', feedback: '铁扇公主愿意听完归还之约' }),
      choice('fan-second-steal', '钻腹夺扇', 'resolve', '化虫入腹逼铁扇交出真扇，不再等牛魔回应。', '悟空取得扇子，也把一场借路变成身体与洞府都被侵入的羞辱。', { relations: { 铁扇: -5, 玄奘: -2 }, flags: { fanSecondPlan: 'coerced' }, routes: { defiance: 4 }, action: 'strike', feedback: '铁扇公主对你的敌意大幅上升' })
    ]),
    '7:2': Object.freeze([
      choice('bull-duel', '与牛魔决胜', 'resolve', '悟空正面斗牛魔变化，八戒封住退路，诸天神将合围。', '牛魔力竭被收伏，真扇归还铁扇后再借，火焰山以一场大战打开。', { relations: { 牛魔: -4, 铁扇: -2, 八戒: 2 }, flags: { bullBattleMethod: 'defeated' }, routes: { defiance: 4 }, action: 'strike', feedback: '牛魔王败服，铁扇公主仍怨你兴兵', play: true }),
      choice('bull-negotiate', '请夫妻同议', 'mercy', '暂停围攻，让铁扇、牛魔与红孩儿把旧账说完，再以山民生计换三扇之约。', '牛魔不甘却应下归还，铁扇亲自持扇出洞；火焰山没有再添一场家破。', { relations: { 牛魔: 3, 铁扇: 4, 红孩: 2, 玄奘: 2 }, flags: { bullBattleMethod: 'settled' }, routes: { bond: 4, discipline: 1 }, action: 'guard', feedback: '牛魔一家认可你让旧账有了说清的机会' }),
      choice('bull-find-proof', '召山民作证', 'insight', '让火焰山百姓带来绝收田契与火伤名册，证明借扇不是师徒私利。', '牛魔再难把此事说成孙悟空寻衅，诸神也转为见证归还之约。', { relations: { 牛魔: 1, 铁扇: 2, 玄奘: 2 }, flags: { bullBattleMethod: 'witnessed' }, routes: { insight: 4 }, action: 'consider', feedback: '铁扇公主认可借扇确为救民' }),
      choice('bull-silent', '沉默迎战', 'insight', '不再提结义旧情，只横棒接住牛魔的混铁棍。', '旧兄弟以兵器说完未说的话，胜负分明，因果却没有因此清楚。', { relations: { 牛魔: -3, 铁扇: -1 }, flags: { bullBattleMethod: 'silent-duel' }, routes: { discipline: 2, defiance: 1 }, action: 'guard', play: true })
    ]),
    '7:3': Object.freeze([
      choice('flame-return-fan', '三扇后归还', 'discipline', '严格照约连扇三次，待火根断绝便亲手把芭蕉扇送回。', '山民重得田土，铁扇守住宝物，强敌之间也留下了一份兑现的承诺。', { trait: 'insight', relations: { 铁扇: 4, 牛魔: 2, 玄奘: 2 }, flags: { flameResolution: 'returned' }, routes: { discipline: 4, bond: 1 }, action: 'bow', feedback: '铁扇公主因你如约归还而改变态度' }),
      choice('flame-keep-fan', '留扇绝后患', 'resolve', '熄火后仍把芭蕉扇留在手中，认为宝物不该再由牛魔一家掌控。', '火焰山永绝复燃之忧，铁扇与牛魔却把借扇之约记成又一次强夺。', { relations: { 铁扇: -5, 牛魔: -4, 玄奘: -2 }, flags: { flameResolution: 'kept' }, routes: { defiance: 4 }, action: 'advance', feedback: '铁扇与牛魔认为你背弃归还之约' }),
      choice('flame-teach', '教乡民守火脉', 'insight', '熄火后与土地标出余烬、风口和借扇时序，让乡民能自行察看火根。', '火焰山从神怪封路变成可被共同照看的土地，师徒离去后也有人守住新田。', { relations: { 玄奘: 3, 铁扇: 2 }, flags: { flameResolution: 'stewarded' }, routes: { insight: 3, bond: 2 }, action: 'consider', feedback: '玄奘认可你为百姓留下长久办法' })
    ]),
    '7:4': Object.freeze([
      choice('pagoda-sweep', '逐层扫塔', 'insight', '从最下层扫到塔顶，查雨痕、血迹与龙鳞，重建佛宝失窃的路径。', '冤僧的口供与塔上痕迹相合，碧波潭成为唯一去向。', { relations: { 玄奘: 3, 龙王: 1 }, flags: { pagodaCase: 'investigated' }, routes: { insight: 4 }, action: 'consider', feedback: '金光寺僧众因真相被查清而洗去冤名' }),
      choice('pagoda-raid', '直闯碧波潭', 'resolve', '凭奔波儿灞口供立刻入潭，打破龙宫夺回舍利。', '佛宝及时归塔，九头虫逃遁，潭中无关水族也被大战波及。', { relations: { 龙王: -2, 玄奘: -1 }, flags: { pagodaCase: 'raided' }, routes: { defiance: 3 }, action: 'strike', feedback: '龙族不认同你未经分辨便掀翻水府' }),
      choice('pagoda-clear-names', '先释冤僧', 'mercy', '把已有证据先交国王，要求释放受刑僧众，再去追回佛宝。', '僧人先脱牢狱，舍利稍后归塔；救宝与救人没有再被倒置。', { relations: { 玄奘: 4 }, flags: { pagodaCase: 'freed-monks' }, routes: { bond: 4, discipline: 1 }, action: 'guard', feedback: '玄奘认可你先洗清无辜者罪名' })
    ]),
    '7:5': Object.freeze([
      choice('thorn-debate', '先听师父复述', 'insight', '收棒听玄奘复述岭中诗会，再指出才情若靠囚住听者便失去本意。', '杏仙与树老哑然，枝蔓自行让出一线，诗会没有变成杀场。', { relations: { 玄奘: 3, 妖: 2 }, flags: { thornPoetry: 'answered' }, routes: { insight: 3, bond: 1 }, action: 'consider', feedback: '玄奘认可你听完始末才处置树精' }),
      choice('thorn-cut', '一棒断根', 'resolve', '悟空看见妖气便打断藤根，不许树精再以诗文拖延。', '荆棘岭迅速开路，几株有灵古木也随妖根一同枯死。', { relations: { 妖: -4, 玄奘: -2 }, flags: { thornPoetry: 'cut' }, routes: { defiance: 3 }, action: 'strike', feedback: '玄奘不认同你把会谈与劫持一并打断' }),
      choice('thorn-depart', '护送谢诗辞岭', 'mercy', '请玄奘向杏仙郑重回礼，自己护在身旁，说明师徒不能留宿。', '树精虽不舍，仍让出岭路；师徒的礼数保住一场不必流血的相逢。', { relations: { 玄奘: 4, 妖: 3 }, flags: { thornPoetry: 'farewell' }, routes: { bond: 3, discipline: 1 }, action: 'bow', feedback: '荆棘岭众精接受了你的郑重告别' }),
      choice('thorn-silent', '沉默护师离岭', 'insight', '不评诗也不斥责，只护住玄奘向岭外走。', '枝蔓因猜不透而收紧，悟空只得开路；这份沉默没有让拒绝更温和。', { relations: { 妖: -2, 玄奘: -1 }, flags: { thornPoetry: 'silent' }, routes: { discipline: 2 }, action: 'withdraw' })
    ]),
    '7:6': Object.freeze([
      choice('little-thunder-bow', '辨像后再拜', 'insight', '在下拜前查莲台背光、钟声回响与佛号次序，发现处处似是而非。', '黄眉不得不提前现形，师徒免入金铙，却仍被人种袋逼到绝境。', { relations: { 弥勒: 2, 玄奘: 2 }, flags: { littleThunderPlan: 'discerned' }, routes: { insight: 4 }, action: 'consider', feedback: '弥勒佛认可你没有只认金身外相' }),
      choice('little-thunder-charge', '砸碎假莲台', 'resolve', '一眼看出妖气便抡棒打向莲台，不等黄眉念完佛号。', '假殿崩塌，黄眉以人种袋收尽众人；悟空虽先动手，仍没避开法宝。', { relations: { 弥勒: -1, 玄奘: -2, 妖: -3 }, flags: { littleThunderPlan: 'attacked' }, routes: { defiance: 3 }, action: 'strike' }),
      choice('little-thunder-rescue', '先放被困诸神', 'mercy', '逃出金铙后不急着追黄眉，先解开同被人种袋困住的神将与僧众。', '援手汇成破局之力，弥勒到来时看到的不是一场个人斗胜。', { relations: { 弥勒: 3, 玄奘: 2 }, flags: { littleThunderPlan: 'rescued' }, routes: { bond: 3, discipline: 1 }, action: 'guard', feedback: '弥勒佛认可你先救同困之人' })
    ]),
    '7:7': Object.freeze([
      choice('zhuzi-heal', '先诊王疾', 'mercy', '先用悬丝与问诊查清忧惧病根，治稳国王再谈救金圣宫。', '国王能下榻议事，救人不再只是一道讨赏的王命。', { relations: { 玄奘: 3 }, flags: { zhuziCure: 'healed-first' }, routes: { bond: 3, insight: 1 }, action: 'guard', feedback: '玄奘认可你先治病再逞神通' }),
      choice('zhuzi-steal-bells', '三骗紫金铃', 'insight', '变化入洞，利用赛太岁贪宴与小妖口风三次调换紫金铃。', '烟、火、沙三铃落入悟空手中，金毛犼也失去依仗。', { relations: { 观音: 1, 妖: -3 }, flags: { zhuziCure: 'outwitted' }, routes: { insight: 4 }, action: 'consider' }),
      choice('zhuzi-demand', '逼妖交人', 'resolve', '持假铃直闯獬豸洞，逼赛太岁立刻交出金圣宫。', '恶战惊动全山，金圣宫趁乱脱身，悟空也险被真铃烟火所困。', { relations: { 妖: -4, 玄奘: 1 }, flags: { zhuziCure: 'forced' }, routes: { defiance: 3 }, action: 'strike' })
    ]),
    '7:8': Object.freeze([
      choice('spider-rush', '破网救师', 'resolve', '悟空不等八戒回报便烧断蛛丝，直入盘丝洞救玄奘。', '唐僧及时脱困，七蜘蛛逃往黄花观，新的伏击也因此提前布下。', { relations: { 八戒: -1, 妖: -3, 玄奘: 2 }, flags: { spiderCavePlan: 'rushed' }, routes: { defiance: 3 }, action: 'strike', play: true }),
      choice('spider-save', '先救被缚侍女', 'mercy', '看见洞中被迫采丝的凡人侍女，先割断她们身上的蛛网。', '蜘蛛精趁隙转移玄奘，侍女却带路指出通往后洞的暗径。', { relations: { 玄奘: 3, 八戒: 2 }, flags: { spiderCavePlan: 'freed-captives' }, routes: { bond: 4 }, action: 'guard', feedback: '玄奘认可你没有略过洞中其他受害者' }),
      choice('spider-trace', '循丝寻七穴', 'insight', '观察蛛丝受力与泉边脚印，先封七处遁穴再进洞。', '七蜘蛛无处转移玄奘，黄花观师兄也被一根残丝提前暴露。', { relations: { 八戒: 2, 妖: -2 }, flags: { spiderCavePlan: 'traced' }, routes: { insight: 4 }, action: 'consider', feedback: '八戒认可你先封退路的判断', play: true }),
      choice('spider-silent', '沉默看住八戒', 'insight', '不追问濯垢泉所见，只让八戒带路补回自己的疏失。', '八戒羞愧领路，师兄弟没有当场争吵，却把尴尬带进黄花观。', { relations: { 八戒: 1 }, flags: { spiderCavePlan: 'silent-account' }, routes: { discipline: 2 }, action: 'listen' })
    ]),
    '8:0': Object.freeze([
      choice('centipede-test-tea', '先验毒茶', 'insight', '见茶色浮金便以毫毛试饮，辨出蜈蚣毒后打翻师徒杯盏。', '百眼魔君未能先毒倒众人，只得展开千眼金光正面困阵。', { relations: { 玄奘: 3, 八戒: 2, 妖: -2 }, flags: { centipedePlan: 'tested' }, routes: { insight: 4 }, action: 'consider', feedback: '师徒因你的谨慎避过毒茶' }),
      choice('centipede-break-light', '迎金光破阵', 'resolve', '悟空闭住火眼强闯千眼金光，试图一棒打断妖魔肋下眼目。', '金光灼伤双眼，黄花观却被打出缺口，只能再请毗蓝婆收尾。', { relations: { 妖: -4, 玄奘: 1 }, flags: { centipedePlan: 'charged' }, routes: { defiance: 3 }, action: 'strike' }),
      choice('centipede-seek-needle', '请毗蓝婆金针', 'mercy', '听黎山老母指点去请毗蓝婆，以昴日星官眼中炼出的金针制光。', '百眼魔君被收去看守洞府，师徒解毒，盘丝洞余怨没有再以赶尽杀绝收场。', { relations: { 玄奘: 3, 妖: 1 }, flags: { centipedePlan: 'needle' }, routes: { bond: 3, discipline: 1 }, action: 'guard', feedback: '玄奘认可你求援解毒而非只争胜' })
    ]),
    '8:1': Object.freeze([
      choice('lioncamel-breach', '分身破三城', 'resolve', '拔毫毛化千百行者，同时冲破青狮、白象与大鹏三处关隘。', '狮驼城妖兵大乱，悟空救出一批百姓，也引来三魔合力封城。', { relations: { 妖: -5, 八戒: 2 }, flags: { lionCamelResolve: 'assault' }, routes: { defiance: 4 }, action: 'strike', feedback: '八戒被你的强攻鼓舞，三魔合围更紧' }),
      choice('lioncamel-hold-team', '先稳住师弟', 'mercy', '在传出唐僧已被蒸食的假讯时先找到八戒悟净，不让队伍因绝望散去。', '师兄弟共同查到蒸笼只是骗局，玄奘尚活，狮驼岭没能用死讯拆散他们。', { relations: { 八戒: 4, 悟净: 4, 玄奘: 2 }, flags: { lionCamelResolve: 'held-together' }, routes: { bond: 4 }, action: 'guard', feedback: '八戒与悟净因你没有独自绝望而更加信任你' }),
      choice('lioncamel-seek-buddha', '循大鹏根脚请佛', 'insight', '从阴阳二气瓶与金翅血脉追到灵山，请如来亲自收伏大鹏。', '青狮白象归主，大鹏也不能再以佛亲身份避责；狮驼国终于开门。', { relations: { 如来: 3, 玄奘: 2, 妖: -2 }, flags: { lionCamelResolve: 'rooted' }, routes: { insight: 4, discipline: 1 }, action: 'consider', feedback: '如来认可你追到三魔背后的主人' }),
      choice('lioncamel-silent', '沉默再入妖城', 'insight', '听见师父死讯后不哭不喊，独自变作小妖再次入城查证。', '悟空查明假讯救出玄奘，八戒悟净却在城外以为师兄也不会回来。', { relations: { 八戒: -2, 悟净: -2, 玄奘: 2 }, flags: { lionCamelResolve: 'silent-infiltration' }, routes: { discipline: 3 }, action: 'withdraw', feedback: '八戒与悟净不满你再次独自涉险' })
    ]),
    '8:2': Object.freeze([
      choice('biqiu-hide-children', '藏起千家小儿', 'mercy', '悟空以毫毛变护符，连夜把一千一百一十一个孩子藏入云中。', '鹅笼一夜皆空，父母重见孩子；国丈再无活心可取，只得现出白鹿真身。', { relations: { 玄奘: 4, 寿星: 1 }, flags: { biqiuChildren: 'saved-all' }, routes: { bond: 4 }, action: 'guard', feedback: '比丘国百姓与玄奘感念你救下所有孩子' }),
      choice('biqiu-confront', '御殿斥国丈', 'resolve', '当着国王砸碎药方，逼国丈说明以童心炼药的邪法。', '国王从迷药中惊醒，白鹿精破殿而逃，妖术在众目之下败露。', { relations: { 妖: -4, 玄奘: 2, 寿星: -1 }, flags: { biqiuChildren: 'confronted' }, routes: { defiance: 3 }, action: 'strike', feedback: '南极寿星认为你惊动坐骑过急，却无法否认童儿获救' }),
      choice('biqiu-trace-master', '查白鹿寿气', 'insight', '从药引、鹿蹄与寿星香火查到白鹿根脚，请南极仙翁亲自下界。', '白鹿被主人收回，寿星也必须面对坐骑借长生之名害童的后果。', { relations: { 寿星: 3, 玄奘: 3 }, flags: { biqiuChildren: 'accounted' }, routes: { insight: 3, discipline: 2 }, action: 'consider', feedback: '南极寿星认可你救童并追清根脚' })
    ]),
    '8:3': Object.freeze([
      choice('bottomless-storm', '直捣无底洞', 'resolve', '悟空变小钻入洞底，现身后一路打穿婚堂与妖窟。', '玄奘被抢回，老鼠精借地道逃到托塔天王香案下，洞中小妖死伤甚多。', { relations: { 李靖: -1, 哪吒: 1, 妖: -4 }, flags: { bottomlessProof: 'stormed' }, routes: { defiance: 3 }, action: 'strike' }),
      choice('bottomless-find-tablet', '取牌位作证', 'insight', '先取出洞中供奉李天王、哪吒的牌位，再上天庭请他们辨认义女。', '李靖无从推诿，哪吒循香火锁定妖踪，收伏有了清楚凭证。', { relations: { 李靖: 2, 哪吒: 3, 玄奘: 2 }, flags: { bottomlessProof: 'tablet' }, routes: { insight: 4, discipline: 1 }, action: 'consider', feedback: '哪吒认可你持证问责而非空口告状' }),
      choice('bottomless-free-captives', '先开地牢', 'mercy', '入洞后先放出历年被掳的僧人与樵夫，让悟净护送出洞。', '老鼠精趁乱转移玄奘，获释者却指出婚堂暗门，救援没有因此断线。', { relations: { 悟净: 3, 玄奘: 3 }, flags: { bottomlessProof: 'freed-captives' }, routes: { bond: 4 }, action: 'guard', feedback: '悟净与玄奘认可你先救所有囚徒' }),
      choice('bottomless-silent', '沉默呈上牌位', 'insight', '到天庭不争辩，只把李天王牌位放在御案前。', '证物替悟空说完问责，李靖仍因这场公开难堪而心生不快。', { relations: { 李靖: -1, 哪吒: 2 }, flags: { bottomlessProof: 'silent-evidence' }, routes: { discipline: 3 }, action: 'listen' })
    ]),
    '8:4': Object.freeze([
      choice('fengxian-defy', '打碎天庭三事', 'resolve', '认为米山、面山与金锁只是在拿百姓受旱惩罚国王，举棒要破天设之限。', '天庭震怒，悟空逼出降雨时辰，凤仙郡得水，却留下又一次公然抗命。', { relations: { 玉帝: -5, 玄奘: -1 }, flags: { fengxianMercy: 'defied' }, routes: { defiance: 4 }, action: 'strike', feedback: '玉帝震怒，玄奘担忧百姓承受后续天罚' }),
      choice('fengxian-repent', '劝王率众改过', 'mercy', '让郡侯向百姓认错、开仓济民并重修被推倒的供桌，以实行动摇三道天限。', '鸡啄尽米、犬舔尽面、烈焰熔锁，甘霖在全城共同补过后落下。', { relations: { 玄奘: 4, 玉帝: 2 }, flags: { fengxianMercy: 'repaired' }, routes: { bond: 3, discipline: 2 }, action: 'guard', feedback: '玄奘认可你让掌权者亲自补偿百姓' }),
      choice('fengxian-appeal', '持旱册上奏', 'insight', '统计三年死伤、粮价与井水，把百姓代价带到通明殿上请求重审。', '玉帝没有立即撤罚，却准天曹把民生与国王一过分开衡量，雨令提前。', { relations: { 玉帝: 3, 玄奘: 3 }, flags: { fengxianMercy: 'appealed' }, routes: { insight: 4 }, action: 'consider', feedback: '玉帝接受了你以百姓实情重审天罚' })
    ]),
    '8:5': Object.freeze([
      choice('yuhua-teach-rules', '先教持兵之戒', 'discipline', '授棒耙铲法前先立三戒：不欺弱、不炫技、不以王子身份压人。', '三位王子学到的不只是招式，兵器被盗后也先护百姓而非追逐脸面。', { trait: 'insight', relations: { 八戒: 2, 悟净: 2, 玄奘: 3 }, flags: { yuhuaTeaching: 'ethics' }, routes: { discipline: 4 }, action: 'guard', feedback: '三位师兄弟认可把戒线放在招式之前' }),
      choice('yuhua-show-power', '各显神兵威势', 'resolve', '三兄弟当众展示金箍棒、钉耙与降妖杖，让王子照式苦练。', '王城喝彩惊动黄狮精，三件神兵当夜被盗，拜师从炫技转成追赃。', { relations: { 八戒: 2, 悟净: 2, 妖: -2 }, flags: { yuhuaTeaching: 'display' }, routes: { defiance: 3 }, action: 'celebrate' }),
      choice('yuhua-share', '师徒分组传艺', 'mercy', '让每位王子除学兵器外，也轮流挑担、守夜和照顾同行。', '王子学会配合，九灵元圣来袭时三人没有各自逞强。', { relations: { 八戒: 3, 悟净: 3, 玄奘: 2 }, flags: { yuhuaTeaching: 'companionship' }, routes: { bond: 4 }, action: 'guard', feedback: '八戒与悟净认可你把同行经验也传下去' })
    ]),
    '8:6': Object.freeze([
      choice('scripture-gift-bowl', '劝以紫金钵作人事', 'mercy', '劝玄奘将唐王所赐紫金钵留给阿傩迦叶，先把有字真经稳稳接下。', '有字真经装满经担，御赐之物留在灵山；师徒对这份“人事”仍各有判断。', { relations: { 如来: 2, 玄奘: 2 }, flags: { scriptureTrust: 'offered-bowl' }, routes: { bond: 2, discipline: 1 }, feedback: '玄奘接受了你先取到有字真经的判断' }),
      choice('scripture-refuse-bribe', '替师父拒绝人事', 'resolve', '伸棒拦下紫金钵，当面追问普度众生为何还要先收私礼。', '师徒第一次取到无字白本，又折返如来座前质问；灵山规矩被迫摆到明处。', { relations: { 如来: -2, 玄奘: 3 }, flags: { scriptureTrust: 'challenged' }, routes: { defiance: 4 }, action: 'advance', feedback: '灵山不满你的质问，玄奘却认可你拦下了私礼' }),
      choice('scripture-check', '逐卷验经', 'insight', '亲自在藏经阁前逐卷验题、页码与墨迹，不因已到灵山便放下怀疑。', '无字白本当场被发现，师徒在启程前换得有字真经，也看清终点仍需辨认。', { relations: { 如来: 1, 玄奘: 4 }, flags: { scriptureTrust: 'verified' }, routes: { insight: 4, discipline: 1 }, action: 'consider', feedback: '玄奘认可你在灵山仍坚持验真' }),
      choice('scripture-silent', '沉默护住经担', 'insight', '不问人事也不验纸页，只护在玄奘身侧接下经担。', '白本随众人离开灵山，直到白雄尊者追来提醒，才知受了无字经。', { relations: { 如来: 1, 玄奘: -2 }, flags: { scriptureTrust: 'silent' }, routes: { discipline: 3 }, action: 'listen', feedback: '玄奘懊悔你们在终点同时放下了查验' })
    ]),
    '8:7': Object.freeze([
      choice('wet-admit-promise', '替师父认下忘诺', 'mercy', '拦住辩解，请玄奘坦言忘了代问寿数，不以八十一难为借口。', '老鼋仍掀翻师徒，却在经卷落水后回身托住众人；失信被承认，尚有重建余地。', { relations: { 老鼋: 2, 玄奘: 3 }, flags: { wetScriptures: 'admitted' }, routes: { bond: 3, discipline: 2 }, feedback: '老鼋虽怒，仍认可你没有替师父推诿失信' }),
      choice('wet-blame-turtle', '先护经再责老鼋', 'resolve', '落水后先抢住经担，再斥老鼋以私怨损坏普度众生的真经。', '大半经卷被抢回，老鼋却沉入河底不再相助；通天河旧诺成为无法补说的裂痕。', { relations: { 老鼋: -5, 玄奘: -1 }, flags: { wetScriptures: 'blamed' }, routes: { defiance: 3 }, action: 'advance', feedback: '老鼋与你结怨，玄奘不认同你用大义遮住忘诺' }),
      choice('wet-save-together', '先救人再捞经', 'mercy', '让悟净托住玄奘，自己与八戒分头捞经，不让任何一人独自护卷。', '人和经都上了岸，仍有数页粘在石上；残缺成为全队共同承担的最后旅痕。', { relations: { 玄奘: 3, 八戒: 3, 悟净: 4, 老鼋: 1 }, flags: { wetScriptures: 'shared-rescue' }, routes: { bond: 4 }, action: 'guard', feedback: '师徒在你的调度下先后接住人与经' }),
      choice('wet-read-loss', '晒经记下缺页', 'insight', '亲手将湿经逐卷铺开，记录粘破的佛本行经页码，不把残缺悄悄掩过。', '经卷留下晒石印与缺页记，东土得到的不再是假装完满的文本。', { relations: { 玄奘: 4, 老鼋: 1 }, flags: { wetScriptures: 'documented' }, routes: { insight: 4 }, action: 'consider', feedback: '玄奘认可你如实留下经卷残缺' })
    ]),
    '8:8': Object.freeze([
      choice('final-return-people', '先把经送入人间', 'mercy', '在受封前先请准将经卷校勘、抄印并送往长安城外与沿途州县。', '五圣名号落下时，真经已不只停在宫门与佛殿，而开始回到一路遇见的人手中。', { relations: { 玄奘: 4, 观音: 2, 如来: 2, 唐王: 3 }, flags: { finalVow: 'share-scripture' }, routes: { bond: 4 }, action: 'guard', feedback: '玄奘与唐王认可你让真经走向百姓' }),
      choice('final-keep-banner', '以斗战之名问天', 'resolve', '接下斗战胜佛封号，却保留齐天旗号，继续追问神佛坐骑下界后的主人之责。', '成佛没有磨平花果山旧旗，西行所得成为向更高秩序发问的新凭据。', { relations: { 玉帝: -2, 如来: -1, 群猴: 4 }, flags: { finalVow: 'keep-defiance' }, routes: { defiance: 4 }, action: 'advance', feedback: '花果山群猴为你仍记得旧旗而振奋' }),
      choice('final-record-causes', '编成八十一旅痕', 'insight', '亲手把每次误认、失信、求援与选择一并写入经后，不只留下功德名目。', '东土读到的不只是胜妖录，而是一部可追问每道因果如何发生的西行长卷。', { relations: { 玄奘: 3, 如来: 2, 魏征: 2 }, flags: { finalVow: 'record-causes' }, routes: { insight: 4 }, action: 'consider', feedback: '玄奘认可你没有删去旅途中的争执与过错' }),
      choice('final-release-fillet', '请解紧箍还心', 'discipline', '受封后先确认紧箍已经自然消失，再向玄奘重申力量仍受共同誓约约束。', '外在金箍不复存在，师徒一路磨出的界线却被主动留下。', { trait: 'insight', relations: { 玄奘: 4, 观音: 2 }, flags: { finalVow: 'self-discipline' }, routes: { discipline: 4, bond: 1 }, action: 'bow', feedback: '玄奘认可你不再需要以咒语守住承诺' })
    ])
  });

  const echo = (when, line) => Object.freeze({ when: Object.freeze(when), line: Object.freeze(line) });
  const branchEchoes = Object.freeze({
    '0:6': Object.freeze([
      echo({ flag: ['keptBodhiSecret', true] }, { kind: '旅痕回声', speaker: '悟空', text: '“祖师嘱咐俺也去不可卖弄。今日只取合手兵器，不拿龙宫上下作耍。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['showedOffMagic', true] }, { kind: '旅痕回声', speaker: '悟空', text: '“离山时那阵喝彩俺也去还记得。今日进了龙宫，正好让他们看看俺的本事！”', emotion: 'determined', action: 'advance' })
    ]),
    '1:0': Object.freeze([
      echo({ flag: ['dragonComplaint', true] }, { kind: '旅痕回声', speaker: '太白', text: '“龙宫与幽冥的奏表都已上达。大圣这次下界，天庭不会只当作一场误会。”', emotion: 'worried', action: 'consider' }),
      echo({ flag: ['dragonDeal', 'courtesy'] }, { kind: '旅痕回声', speaker: '太白', text: '“东海虽来奏事，却也承认你入宫时尚知礼数。此间仍有转圜。”', emotion: 'calm', action: 'listen' })
    ]),
    '1:5': Object.freeze([
      echo({ flag: ['emptyTitle', 'watched'] }, { kind: '旅痕回声', speaker: '悟空', text: '“空名俺也去看过了。如今兵都压到山门，这口气再也不忍！”', emotion: 'angry', action: 'guard' }),
      echo({ flag: ['peachChoice', 'shared'] }, { kind: '旅痕回声', speaker: '哪吒', text: '“你把蟠桃分给守园仙吏，此事天庭上下议论不休。但今日阵前，仍要以兵器说话。”', emotion: 'alert', action: 'advance' }),
      echo({ flag: ['peachHarvestKept', true] }, { kind: '旅痕回声', speaker: '哪吒', text: '“守园时你分得清熟桃、青桃与天册，今日也该分清来将与身后群猴，不要只顾追阵。”', emotion: 'alert', action: 'guard' }),
      echo({ flag: ['peachGardenMastery', true] }, { kind: '心理活动', speaker: '悟空', text: '（蟠桃落枝时练出的掌心分寸仍在。悟空先看清哪一击会真正伤到群猴。）', voice: false, emotion: 'determined', action: 'guard' })
    ]),
    '1:6': Object.freeze([
      echo({ flag: ['heavenBattleMastery', true] }, { kind: '旅痕回声', speaker: '二郎', text: '“方才你在山门前连截数阵，不只会凭蛮力。如今再以变化分个高下。”', emotion: 'alert', action: 'guard' })
    ]),
    '1:7': Object.freeze([
      echo({ flag: ['knowsXunGate', true] }, { kind: '心理活动', speaker: '悟空', text: '（悟空想起巽位有风，那是八卦炉里唯一可能的生门。）', voice: false, emotion: 'surprised', action: 'consider' }),
      echo({ flag: ['erlangDuelMastery', true] }, { kind: '心理活动', speaker: '悟空', text: '（二郎起手尚有预兆，八卦炉的火候也不会全无线索。）', voice: false, emotion: 'thoughtful', action: 'consider' })
    ]),
    '3:1': Object.freeze([
      echo({ flag: ['mountainYears', 'awaited'] }, { kind: '心理活动', speaker: '悟空', text: '（五百年里想过无数次的脚步终于停在山前，悟空反而收住了喊声。）', voice: false, emotion: 'relieved', action: 'listen' }),
      echo({ flag: ['mountainYears', 'defiant'] }, { kind: '旅痕回声', speaker: '悟空', text: '“压俺也去五百年，还想叫俺也去低声求人？取经人若肯救便救，俺也去不跪着求。”', emotion: 'angry', action: 'advance' })
    ]),
    '3:3': Object.freeze([
      echo({ flag: ['discipleship', 'bowed'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“你在山下叩首时，我以为师徒二字已经足够。今日为何仍走到这道箍前？”', emotion: 'worried', action: 'consider' }),
      echo({ flag: ['rescuePromise', 'honest'] }, { kind: '旅痕回声', speaker: '悟空', text: '“我早把闹天宫的旧事说尽。师父若仍怕我，也该明言，不必借一顶帽子相欺。”', emotion: 'angry', action: 'withdraw' })
    ]),
    '3:7': Object.freeze([
      echo({ flag: ['blackWindRecovered', true] }, { kind: '心理活动', speaker: '悟空', text: '（黑风洞最后仍请观音收局。到了高老庄，悟空不急着把又一个妖怪只看作棒下胜负。）', voice: false, emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['blackWindMastery', true] }, { kind: '心理活动', speaker: '悟空', text: '（黑风里尚能看见兵器闪光，这次也可从钉耙落点判断来者究竟在护谁。）', voice: false, emotion: 'alert', action: 'listen' })
    ]),
    '4:5': Object.freeze([
      echo({ flag: ['wuzhuangFruitMethod', 'asked'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“先前既肯依礼问果，此刻也莫让童子几句辱骂毁了那份分寸。”', emotion: 'worried', action: 'guard' }),
      echo({ flag: ['wuzhuangFruitMethod', 'stole'] }, { kind: '旅痕回声', speaker: '镇元', text: '“果是背人摘的，树也是怒中推的。两笔账，不能只认后面一笔。”', emotion: 'angry', action: 'advance' })
    ]),
    '4:6': Object.freeze([
      echo({ flag: ['ginsengTreeResponse', 'owned'] }, { kind: '旅痕回声', speaker: '镇元', text: '“你肯说一人担责，贫道便只留你求方。其余师徒，不必再绑。”', emotion: 'thoughtful', action: 'listen' }),
      echo({ flag: ['ginsengTreeResponse', 'felled'] }, { kind: '心理活动', speaker: '悟空', text: '（倒树那一棒越想越重。求遍三岛时，悟空已不能再把它说成一时痛快。）', voice: false, emotion: 'worried', action: 'consider' })
    ]),
    '4:8': Object.freeze([
      echo({ flag: ['filletResponse', 'covenant'] }, { kind: '旅痕回声', speaker: '悟空', text: '“师父，两界山时你答应过，不因争执轻念紧箍咒。今日这份约定还算不算？”', emotion: 'pained', action: 'recoil' }),
      echo({ flag: ['filletResponse', 'resented'] }, { kind: '心理活动', speaker: '悟空', text: '（最初那场欺瞒从未真正过去；这次咒声只是把旧裂痕重新扯开。）', voice: false, emotion: 'angry', action: 'withdraw' }),
      echo({ flag: ['whiteBoneMethod', 'proved'] }, { kind: '旅痕回声', speaker: '悟空', text: '“三次饭食、脚印与魂魄都验过了。师父若仍逐我，请说清你不信的是证据，还是我。”', emotion: 'pained', action: 'consider' }),
      echo({ flag: ['whiteBoneMethod', 'swift'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“我只见你连落三棒，却没听你说清妖怪的破绽。如今尸身都在眼前，我怎敢不疑？”', emotion: 'worried', action: 'withdraw' }),
      echo({ flag: ['whiteBoneDiscerned', true] }, { kind: '旅痕回声', speaker: '玄奘', text: '“三次变化的脚印、斋饭和离体白光，我都看见了。我仍惧你杀心，却不能说你毫无凭据。”', emotion: 'worried', action: 'consider' })
    ]),
    '5:1': Object.freeze([
      echo({ flag: ['exileResponse', 'left-help'] }, { kind: '旅痕回声', speaker: '八戒', text: '“猴哥，救命毫毛俺也去带来了。你说过师父有难仍来，这句话可还算数？”', emotion: 'worried', action: 'advance' }),
      echo({ flag: ['exileResponse', 'severed'] }, { kind: '心理活动', speaker: '悟空', text: '（撕碎的贬书仿佛还在白骨岭风里。回去救人，便要先越过自己说过的决绝话。）', voice: false, emotion: 'angry', action: 'consider' }),
      echo({ flag: ['whiteBoneMethod', 'captured'] }, { kind: '旅痕回声', speaker: '八戒', text: '“白骨岭上真形都摆到眼前，师父仍错怪了你。这回俺也去把真话说全，不再只会激你。”', emotion: 'worried', action: 'listen' })
    ]),
    '5:4': Object.freeze([
      echo({ flag: ['whiteBoneMethod', 'proved'] }, { kind: '旅痕回声', speaker: '悟空', text: '“白骨岭错过三次解释，这回俺也去先把绳结、脚印与火气逐样说清，师父再断真假。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['whiteBoneMethod', 'swift'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“你若又只说火眼看见了妖，至少先让我看见你为何这样判断。”', emotion: 'worried', action: 'guard' })
    ]),
    '5:6': Object.freeze([
      echo({ flag: ['redBoySuspicion', 'proved'] }, { kind: '旅痕回声', speaker: '观音', text: '“你先验出他的变化，今日也该明白：收伏不只要压住火，更要让他认下所为。”', emotion: 'calm', action: 'consider' }),
      echo({ flag: ['redBoySuspicion', 'struck'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“先前未辨清便出棒，今日既已制住他，就莫再把惩戒当成泄愤。”', emotion: 'worried', action: 'guard' }),
      echo({ flag: ['samadhiFireRead', true] }, { kind: '旅痕回声', speaker: '观音', text: '“你已辨清三昧火借雨生烟的势头，也肯在负伤后留下退路。今日收伏，便由你守住火云洞外。”', emotion: 'calm', action: 'guard' }),
      echo({ flag: ['samadhiFireMastery', true] }, { kind: '旅痕回声', speaker: '观音', text: '“三道火路皆被你看破，换气之隙也没有错过。能辨火势，才知道净瓶该落在何处。”', emotion: 'relieved', action: 'consider' })
    ]),
    '6:0': Object.freeze([
      echo({ flag: ['chechiMethod', 'liberated'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“殿外获释僧众皆是此事证人。今日如何处置三妖，也该让他们听见。”', emotion: 'thoughtful', action: 'listen' }),
      echo({ flag: ['chechiMethod', 'public'] }, { kind: '旅痕回声', speaker: '悟空', text: '“三场斗法全城都看着。最后一局若还赌命，便不能只拿一句妖怪自找搪塞。”', emotion: 'determined', action: 'consider' })
    ]),
    '6:2': Object.freeze([
      echo({ flag: ['tongtianChildren', 'documented'] }, { kind: '旅痕回声', speaker: '悟空', text: '“菩萨，十二年祭册俺也去带来了。不能一句金鱼归池，就抹掉童男童女的旧账。”', emotion: 'determined', action: 'advance' }),
      echo({ flag: ['tongtianChildren', 'silent-sacrifice'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“你替孩子坐上祭盘时一句话也没留。今日收妖，莫再让旁人猜你的用意。”', emotion: 'worried', action: 'listen' })
    ]),
    '6:7': Object.freeze([
      echo({ route: ['bond', 18] }, { kind: '旅痕回声', speaker: '悟空', text: '“你学得了俺模样声音，却答不上这一路俺也去护过谁。假的就是假的！”', emotion: 'determined', action: 'guard' }),
      echo({ route: ['defiance', 18] }, { kind: '旅痕回声', speaker: '六耳', text: '“你一路靠反抗写下名号，我只需比你更像那份不服，谁又分得清？”', emotion: 'sly', action: 'advance' }),
      echo({ flag: ['exileResponse', 'questioned'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“白骨岭分别时，你逼我逐条说清逐你的缘由。如今辨真假，我也该逐条问，不可只凭眼前。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['returnAfterExile', 'forgiven'] }, { kind: '旅痕回声', speaker: '六耳', text: '“你曾因师父一难就回头。我若只学你的怒，却学不会那次回头，便还少了最像你的一段。”', emotion: 'sly', action: 'listen' })
    ]),
    '6:8': Object.freeze([
      echo({ flag: ['monkeyIdentityProof', 'memories'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“共同记忆已经指出真身。佛祖揭破六耳后，我们该问的是败者如何承担，不再是谁更像。”', emotion: 'thoughtful', action: 'listen' }),
      echo({ flag: ['monkeyIdentityProof', 'combat'] }, { kind: '旅痕回声', speaker: '如来', text: '“若只凭谁打得更狠来判真假，六耳便永远能学你。现在你要决定的，是还要不要继续这样证明。”', emotion: 'calm', action: 'consider' }),
      echo({ flag: ['monkeyIdentityProof', 'restraint'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“悟空，你方才已经放下一次铁棒。真相既明，还能否把这份克制守到最后？”', emotion: 'worried', action: 'guard' }),
      echo({ flag: ['sixEarDiscerned', true] }, { kind: '旅痕回声', speaker: '玄奘', text: '“一路共同经历已经先于胜负指出真身。到了佛祖座前，我不该再只问哪一个行者更强。”', emotion: 'thoughtful', action: 'listen' }),
      echo({ flag: ['sixEarDuelMastery', true] }, { kind: '旅痕回声', speaker: '如来', text: '“你没有追着表象出棒，而是从他抢拍与听声的习惯里辨出六耳。既已看清，便更该知道如何收尾。”', emotion: 'calm', action: 'consider' })
    ]),
    '7:2': Object.freeze([
      echo({ flag: ['fanApproach', 'courtesy'] }, { kind: '旅痕回声', speaker: '铁扇', text: '“你第一次尚知在洞外行礼。今日若真为借路，就别让天兵替你把话说完。”', emotion: 'worried', action: 'listen' }),
      echo({ flag: ['fanApproach', 'force'] }, { kind: '旅痕回声', speaker: '牛魔', text: '“头一回便打进我家门，如今再谈结义与借扇，未免太迟！”', emotion: 'angry', action: 'advance' }),
      echo({ flag: ['fanSecondPlan', 'covenant'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“山民和土地都记得归还之约。今日无论胜负，借来的扇都必须还。”', emotion: 'thoughtful', action: 'guard' })
    ]),
    '7:3': Object.freeze([
      echo({ flag: ['bullBattleMethod', 'settled'] }, { kind: '旅痕回声', speaker: '铁扇', text: '“我亲自与你到火口，依约完成三扇。今日这扇是借，不是被谁夺走。”', emotion: 'relieved', action: 'advance' }),
      echo({ flag: ['bullBattleMethod', 'defeated'] }, { kind: '心理活动', speaker: '悟空', text: '（诸神押住牛魔的身影还在山后，手中真扇因此更像战利品，也更考验是否归还。）', voice: false, emotion: 'determined', action: 'consider' }),
      echo({ flag: ['fanSecondPlan', 'coerced'] }, { kind: '旅痕回声', speaker: '铁扇', text: '“钻腹逼扇的旧账，我没有忘。且看你灭火之后，肯不肯把扇子还回来。”', emotion: 'angry', action: 'listen' }),
      echo({ flag: ['bullBattleHeld', true] }, { kind: '旅痕回声', speaker: '八戒', text: '“方才两阵俺也去都替你守住了侧边。如今扇火，咱们再照约把最后一步做全。”', emotion: 'determined', action: 'guard' }),
      echo({ flag: ['bullBattleMastery', true] }, { kind: '旅痕回声', speaker: '八戒', text: '“你把老牛两次冲阵都引到山壁，俺也去才能封住退路。三扇收火，照旧一人一步。”', emotion: 'relieved', action: 'guard' })
    ]),
    '7:4': Object.freeze([
      echo({ flag: ['plantainRhythmKept', true] }, { kind: '旅痕回声', speaker: '悟空', text: '“火焰山是依次息火、生风、降雨才冷透的。今日扫塔，也先看清余患再动棒。”', emotion: 'thoughtful', action: 'consider' })
    ]),
    '7:6': Object.freeze([
      echo({ flag: ['trialHeart', 'recognized'] }, { kind: '心理活动', speaker: '悟空', text: '（四圣试心时的幻宅尚有破绽；眼前金身、钟鼓与佛号越齐全，越不能只看外相。）', voice: false, emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['trialHeart', 'silent'] }, { kind: '旅痕回声', speaker: '八戒', text: '“猴哥，上回你看出试探却不提醒我。这次若又有不对，可别只站着看。”', emotion: 'worried', action: 'listen' })
    ]),
    '8:1': Object.freeze([
      echo({ flag: ['monkeyIdentityProof', 'memories'] }, { kind: '旅痕回声', speaker: '八戒', text: '“真假猴王那回，咱们靠一路旧事认回师兄。今日妖怪只说师父已死，俺也去不信！”', emotion: 'determined', action: 'guard' }),
      echo({ flag: ['sixEarEnding', 'killed'] }, { kind: '心理活动', speaker: '悟空', text: '（六耳死后曾以为真假已清；此刻听见师父被蒸的假讯，悟空才知“看见结局”仍可能是一场骗局。）', voice: false, emotion: 'pained', action: 'consider' }),
      echo({ flag: ['spiderWebRead', true] }, { kind: '旅痕回声', speaker: '八戒', text: '“盘丝洞里咱们沿八处受力破绽撕开了网。狮驼岭这句假死讯，也得先找它从哪一根丝上传来。”', emotion: 'determined', action: 'consider' }),
      echo({ flag: ['spiderWebMastery', true] }, { kind: '心理活动', speaker: '悟空', text: '（盘丝洞里连续断开的受力线还在眼前；狮驼岭的假讯也有一条被人故意绷紧的来路。）', voice: false, emotion: 'thoughtful', action: 'consider' })
    ]),
    '8:4': Object.freeze([
      echo({ flag: ['underworldMethod', 'questioned'] }, { kind: '旅痕回声', speaker: '悟空', text: '“幽冥拿天命推寿数，天庭又拿国王一过压全郡百姓。这样的推诿，俺也去见过！”', emotion: 'angry', action: 'advance' })
    ]),
    '8:6': Object.freeze([
      echo({ flag: ['daughterFarewell', 'honest'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“女儿国城门前，我因坦言尚能守住敬意。今日灵山索人事，我也当把疑问说清。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['daughterFarewell', 'deceived'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“女儿国那次权宜，我至今有愧。今日再遇含糊规矩，不能又拿结果替手段开脱。”', emotion: 'worried', action: 'listen' })
    ]),
    '8:7': Object.freeze([
      echo({ flag: ['turtlePromise', 'asked'] }, { kind: '旅痕回声', speaker: '老鼋', text: '“过河时我把寿数托给你们问。一路妖魔记得，偏把这一句忘了么？”', emotion: 'angry', action: 'advance' }),
      echo({ flag: ['turtlePromise', 'recorded'] }, { kind: '心理活动', speaker: '悟空', text: '（通天河岸曾把老鼋之问记入行囊，可到了灵山仍无人翻开。记下却未做到，同样是失信。）', voice: false, emotion: 'worried', action: 'consider' })
    ]),
    '8:8': Object.freeze([
      echo({ relation: ['玄奘', 12] }, { kind: '旅痕回声', speaker: '玄奘', text: '“这一路最难得的，不是从未争执，而是每次分开之后仍肯回来把话说完。”', emotion: 'relieved', action: 'listen' }),
      echo({ relation: ['玄奘', -4] }, { kind: '旅痕回声', speaker: '玄奘', text: '“经已取回，有些未能说开的旧伤却不能由封号替我们抹去。”', emotion: 'worried', action: 'consider' }),
      echo({ flag: ['whiteBoneMethod', 'captured'] }, { kind: '旅痕回声', speaker: '悟空', text: '“白骨岭留下的不是三具假身，是先证真相、再作处置的教训。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['daughterFarewell', 'honest'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“西梁城门那场坦白没留住女王，却教会贫僧：告别也须郑重，不可让沉默代替。”', emotion: 'relieved', action: 'bow' }),
      echo({ flag: ['flameResolution', 'returned'] }, { kind: '旅痕回声', speaker: '悟空', text: '“芭蕉扇俺也去最后还回去了。赢了强敌还能守约，这才算没白走火焰山。”', emotion: 'relieved', action: 'listen' }),
      echo({ flag: ['scriptureTrust', 'verified'] }, { kind: '旅痕回声', speaker: '玄奘', text: '“灵山也递过无字白本。到了终点，辨认真伪的责任并没有消失。”', emotion: 'thoughtful', action: 'consider' }),
      echo({ flag: ['wetScriptures', 'documented'] }, { kind: '旅痕回声', speaker: '悟净', text: '“晒石粘破的经页，我们如实记下。圆满不能靠遮住缺口来冒充。”', emotion: 'relieved', action: 'guard' }),
      echo({ flag: ['scriptureRescued', true] }, { kind: '旅痕回声', speaker: '悟净', text: '“落水真经是我们逐卷分开、缓缓揭页，连残片一并护回东土。这份圆满，本就带着真实水痕。”', emotion: 'relieved', action: 'guard' })
    ])
  });

  const whiteBonePerformance = Object.freeze({
    maiden: 'assets/characters/white-bone/disguises/maiden-offering.png',
    oldWoman: 'assets/characters/white-bone/disguises/old-woman-accusing.png',
    oldMan: 'assets/characters/white-bone/disguises/old-man-accusing.png',
    trueForm: 'assets/characters/white-bone/true-form-reveal-portrait.png'
  });

  const sceneScripts = Object.freeze({
    '4:7': Object.freeze([
      Object.freeze({
        kind: '旁白',
        speaker: null,
        text: '白骨岭山风刮过荒村。一个送饭村姑提篮近前，唐僧只见人形，悟空却看见皮囊后的妖气。',
        art: Object.freeze({ 白骨: whiteBonePerformance.maiden }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的村姑', role: '山中送饭人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '白骨',
        voice: '白骨村姑',
        text: '“长老们赶路辛苦，我篮中有斋饭，且用些再走。”',
        emotion: 'sly',
        action: 'advance',
        art: Object.freeze({ 白骨: whiteBonePerformance.maiden }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的村姑', role: '山中送饭人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '悟空',
        text: '“师父，这是解尸法。倒下的是皮，跑掉的是妖。”',
        emotion: 'alert',
        action: 'consider',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldWoman }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老妇', role: '寻女的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '玄奘',
        text: '“你又伤人了。她只是来送一篮斋饭。”',
        emotion: 'worried',
        action: 'guard',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldWoman }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老妇', role: '寻女的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '白骨',
        voice: '白骨老妇',
        text: '“方才可曾见我送饭的女儿？她怎会倒在这里？”',
        emotion: 'worried',
        action: 'advance',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldWoman }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老妇', role: '寻女的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '悟空',
        text: '“又来一个。火眼没花，还是那缕妖气。”',
        emotion: 'determined',
        action: 'strike',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldMan }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老翁', role: '寻亲的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '玄奘',
        text: '“先别动手。让他把话说完。”',
        emotion: 'worried',
        action: 'guard',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldMan }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老翁', role: '寻亲的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '白骨',
        voice: '白骨老翁',
        text: '“我的女儿和老妻都不见了，你们须还我一个明白！”',
        emotion: 'angry',
        action: 'advance',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldMan }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老翁', role: '寻亲的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '对白',
        speaker: '悟空',
        text: '“师父眼前是人，我眼前却是要害你的妖。它换三张脸，妖气也瞒不过俺也去。”',
        emotion: 'determined',
        action: 'strike',
        art: Object.freeze({ 白骨: whiteBonePerformance.oldMan }),
        presentation: Object.freeze({ 白骨: Object.freeze({ name: '可疑的老翁', role: '寻亲的山中人', seal: '疑' }) })
      }),
      Object.freeze({
        kind: '旁白',
        speaker: null,
        text: '三张面孔已经叠在同一缕妖气上。唐僧只看见哭声，你看见的是同一只白骨。下一棒打不打，还等你开口。',
        art: Object.freeze({ 白骨: whiteBonePerformance.trueForm })
      })
    ])
  });

  const actionSheet = (sheet, states) => Object.freeze({
    sheet,
    columns: 4,
    rows: 2,
    states: Object.freeze(Object.fromEntries(Object.entries(states).map(([state, cell]) => [state, Object.freeze(cell)])))
  });
  const playerActionCells = Object.freeze({
    idle: [0, 0], move: [1, 0], attack: [2, 0], charge: [3, 0],
    chargeAttack: [0, 1], dodge: [1, 1], hit: [2, 1], victory: [3, 1], defeated: [2, 1]
  });
  const enemyActionCells = Object.freeze({
    idle: [0, 0], move: [1, 0], attack: [2, 0], charge: [3, 0],
    chargeAttack: [2, 0], dodge: [1, 1], hit: [2, 1], victory: [3, 1], defeated: [3, 1]
  });
  const greatSageActions = actionSheet('assets/minigames/fighters/wukong/great-sage/action-sheet.png', playerActionCells);
  const pilgrimWukongActions = actionSheet('assets/minigames/fighters/wukong/pilgrim-circlet/action-sheet.png', playerActionCells);
  const heavenSoldierActions = actionSheet('assets/minigames/fighters/heaven-soldier/action-sheet.png', enemyActionCells);
  const nezhaActions = actionSheet('assets/minigames/fighters/nezha/action-sheet.png', enemyActionCells);
  const blackBearActions = actionSheet('assets/minigames/fighters/black-bear/action-sheet.png', enemyActionCells);
  const redBoyActions = actionSheet('assets/minigames/fighters/red-boy/action-sheet.png', enemyActionCells);
  const bullWarriorActions = actionSheet('assets/minigames/fighters/bull-demon/warrior-action-sheet.png', enemyActionCells);
  const bullTrueFormActions = actionSheet('assets/minigames/fighters/bull-demon/true-form-action-sheet.png', enemyActionCells);

  const quickQuiz = (id, title, intro, rounds, flag, extra = {}) => Object.freeze({
    type: 'quiz', id, title, intro,
    rounds: Object.freeze(rounds.map(([prompt, options, answer, success]) => Object.freeze({ prompt, options: Object.freeze(options), answer, success }))),
    reward: Object.freeze({ routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ [flag]: true }) }),
    feedback: `你完成了“${title}”，后续剧情会记住这次表现`,
    ...extra
  });

  const additionalMiniGames = Object.freeze({
    '0:0': quickQuiz('stone-birth', '破石初醒', '跟随石壳裂纹找准发力顺序，不让碎石伤到围拢的群猴。', [
      ['第一道裂纹从头顶落下，先护住哪里？', ['双眼与头颈', '脚下碎石', '远处树枝'], 0, '石屑被挡在眼外，石猴看清了花果山。'],
      ['石壳卡住肩膀，怎样脱身最稳？', ['猛撞同一处', '沿裂缝转肩', '停在原地'], 1, '顺着裂缝转身，石壳没有整块砸下。'],
      ['群猴受惊后退，第一步怎么回应？', ['追上去大叫', '举手示意没有敌意', '掷石试探'], 1, '群猴看懂了手势，没有四散逃开。']
    ], 'stoneBirthCleared'),
    '0:2': quickQuiz('raft-voyage', '扎筏出海', '挑木、结绳、辨风向，亲手完成猴王离山的第一段航程。', [
      ['哪种木料更适合做筏身？', ['已经腐空的枯木', '粗直且干燥的树干', '刚折下的细枝'], 1],
      ['浪从东南推来，木筏该怎样调整？', ['横着迎浪', '斜切浪头', '完全松开绳索'], 1],
      ['淡水快用尽时先做什么？', ['喝海水', '收集晨露和雨水', '丢掉水囊'], 1]
    ], 'raftVoyageCleared'),
    '0:3': quickQuiz('fangcun-path', '方寸寻门', '从樵歌、山径和石碑中找出斜月三星洞。', [
      ['樵夫歌中“灵台”指向哪里？', ['闹市酒楼', '山中清静处', '东海龙宫'], 1],
      ['山路出现三岔，哪条更可能通往洞府？', ['有新扫落叶的一条', '完全塌毁的一条', '直下深涧的一条'], 0],
      ['抵达洞门后怎样表明来意？', ['砸门挑战', '报明求道来历', '躲进院中'], 1]
    ], 'fangcunPathCleared'),
    '0:4': quickQuiz('name-riddle', '悟空解字', '听懂祖师从“猢狲”取姓、按排行赐名的用意。', [
      ['祖师为何取“孙”为姓？', ['来自猢狲之意', '来自山名', '来自兵器'], 0],
      ['“悟”字表示什么？', ['门中排行', '官职高低', '出生年月'], 0],
      ['受名后第一件事应做什么？', ['向同门行礼', '立刻离山', '改回旧名'], 0]
    ], 'nameRiddleCleared'),
    '0:7': quickQuiz('ledger-strike', '划除生死簿', '在幽冥册页中找到猴属名籍，避开无辜生灵的寿数。', [
      ['账册堆叠混乱，先按什么查找？', ['族属与籍贯', '纸张颜色', '字迹大小'], 0, '花果山猴属名籍被单独找出。'],
      ['同名条目很多，怎样避免误划？', ['核对花果山与猴属', '整页全部涂掉', '只看名字首字'], 0, '籍贯与族属相合，名目没有错认。'],
      ['朱笔落下前还要确认什么？', ['只改猴属名籍', '连邻页一并撕毁', '把判官名字也划掉'], 0, '朱笔只落在目标名籍上，其余寿数没有被波及。']
    ], 'ledgerNamesStruck'),
    '0:8': quickQuiz('heaven-horses', '御马监驯马', '辨认天马脾性，在最短时间内稳住惊群。', [
      ['白蹄马不断刨地，表示什么？', ['焦躁准备冲栏', '已经睡着', '正在进食'], 0],
      ['马群受雷声惊动，先处理哪匹？', ['领头马', '最远的马', '已经趴下的马'], 0],
      ['马群安定后怎样检查？', ['清点缰绳与蹄伤', '立刻全部放走', '不再靠近'], 0]
    ], 'heavenHorsesCalmed'),
    '1:0': quickQuiz('banner-defense', '花果山布防', '竖起齐天旗前安排岗哨、退路与群猴避险。', [
      ['天兵从云路压近，先设哪处岗哨？', ['最高峰瞭望位', '洞府最深处', '水下暗流'], 0],
      ['幼猴与伤者应该撤到哪里？', ['水帘洞后路', '山门正中', '天兵阵前'], 0],
      ['齐天旗升起后谁负责传令？', ['熟悉山路的老猴', '无人传令', '被俘天兵'], 0]
    ], 'bannerDefenseReady'),
    '1:3': quickQuiz('yaochi-route', '瑶池潜行', '避开巡宴仙官，找出返回花果山的云路。', [
      ['宴前脚步密集，哪条路最少遇人？', ['运酒侧廊', '正殿中央', '乐班前排'], 0],
      ['巡官突然折返，怎样藏住行迹？', ['化作廊柱纹饰', '高声问路', '撞翻酒案'], 0],
      ['离开前如何确认没有追兵？', ['借云影回望', '一路大笑', '留下姓名'], 0]
    ], 'yaochiRouteFound'),
    '1:4': quickQuiz('elixir-gourds', '兜率辨丹', '分清葫芦中的丹药与机关，找到炉房出口。', [
      ['哪只葫芦刚被童子取用？', ['封蜡尚温的一只', '积灰最厚的一只', '已经破裂的一只'], 0],
      ['丹房忽然起烟，出口可能在哪边？', ['有新风进入的一侧', '烟最浓的一侧', '炼炉正下方'], 0],
      ['离开前怎样避免触发铃索？', ['贴梁绕过垂线', '扯断全部绳索', '敲钟试音'], 0]
    ], 'elixirRoomRead'),
    '3:3': quickQuiz('circlet-warning', '辨认花帽', '从针脚、符纸与观音留下的暗示中辨认紧箍儿。', [
      ['花帽内侧藏着什么异常？', ['细密金线与符纹', '普通棉布', '一片树叶'], 0],
      ['玄奘反复劝戴，先该问什么？', ['帽子的来历', '帽子价格', '帽子颜色'], 0],
      ['察觉法器后怎样回应更稳妥？', ['把疑问当面说清', '立刻打伤师父', '假装毫不知情'], 0]
    ], 'circletWarningRead'),
    '3:5': quickQuiz('monastery-fire', '观音院救火', '在火势蔓延前救人、隔火并追查袈裟去向。', [
      ['偏殿先起火，第一步做什么？', ['疏散僧众', '寻找宝箱', '关闭所有出口'], 0],
      ['风把火吹向正殿，怎样隔断？', ['拆开相连木廊', '继续添油', '打开经柜'], 0],
      ['袈裟趁乱失踪，应追哪条线索？', ['屋顶留下的黑风', '井边水迹', '厨房米袋'], 0]
    ], 'monasteryFireContained'),
    '4:4': quickQuiz('ginseng-fruit', '人参果寻踪', '根据落土即入的特性找出果实去向。', [
      ['果子坠地后不见，先查什么？', ['土中灵气', '屋顶瓦片', '井中倒影'], 0],
      ['金击子为何必须垫布接果？', ['避免果子触土遁走', '让果子更甜', '方便称重'], 0],
      ['童子前来盘问时怎样核对数量？', ['对照枝头与果盘', '随口报数', '推倒果树'], 0]
    ], 'ginsengTrailRead'),
    '5:4': quickQuiz('red-boy-disguise', '识破假童', '从脚印、火气与说辞中识破红孩儿的求救变化。', [
      ['孩童悬在树上，地面却有什么异常？', ['没有挣扎脚印', '散落许多玩具', '有村民足迹'], 0],
      ['他自称走失，衣角为何可疑？', ['带着焦灼火气', '沾着普通泥土', '缝得很整齐'], 0],
      ['确认变化后怎样避免师父被掳？', ['先设毫毛警戒', '四人同时离开', '把兵器丢远'], 0]
    ], 'redBoyDisguiseRead'),
    '6:1': quickQuiz('tongtian-children', '救出祭童', '替陈家庄孩子换位、留记号并守住河岸。', [
      ['换下祭童前先确认什么？', ['妖怪来路与时辰', '祭盘颜色', '村长衣着'], 0],
      ['孩子撤离后藏在哪里更安全？', ['远离河岸的地窖', '祭台背后', '冰面中央'], 0],
      ['悟空八戒上祭盘后谁守后路？', ['悟净与玄奘', '无人', '让孩子返回'], 0]
    ], 'tongtianChildrenSafe'),
    '7:0': quickQuiz('first-fan', '一调芭蕉扇', '辨认铁扇公主的拒意与假扇留下的破绽。', [
      ['洞门不开时先做什么？', ['说明借扇缘由', '直接砸门', '转身离开百姓'], 0],
      ['扇面无风，可能说明什么？', ['拿到的是假扇', '火山已经熄灭', '自己失去法力'], 0],
      ['被扇飞前怎样留下回程记号？', ['拔毫毛定方位', '丢掉金箍棒', '闭眼不记方向'], 0]
    ], 'firstFanRead'),
    '8:2': quickQuiz('save-children', '比丘国救婴', '避开宫卫，把孩子从药引名单中逐一救出。', [
      ['名单上的孩子分散全城，先按什么行动？', ['街坊分区', '年龄大小', '名字笔画'], 0],
      ['宫卫巡查时怎样转移孩子？', ['分批走后巷', '全员冲正门', '留在笼中'], 0],
      ['救出后还要保留什么？', ['药引名单作为证据', '只留下空笼', '烧掉全部记录'], 0]
    ], 'childrenLedgerSaved')
  });

  const miniGames = Object.freeze({
    ...additionalMiniGames,
    '0:1': Object.freeze({
      type: 'quiz',
      id: 'water-curtain',
      title: '穿瀑试胆',
      intro: '读准瀑布节拍，替石猴找出落脚处。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '白浪拍向石壁，哪一刻最适合起跳？', options: Object.freeze(['浪头最高时', '回落露出石缝时', '背过身等待']), answer: 1 }),
        Object.freeze({ prompt: '瀑布后传来空洞回声，下一步怎么走？', options: Object.freeze(['贴壁探脚', '闭眼直冲', '原路退回']), answer: 0 }),
        Object.freeze({ prompt: '洞内已有石桥，怎样向群猴报信？', options: Object.freeze(['独占洞府', '折枝为记再返回', '高声惊动山兽']), answer: 1 })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 群猴: 1 }), routes: Object.freeze({ insight: 1 }) }),
      feedback: '你看准了水势，群猴更信服你'
    }),
    '0:5': Object.freeze({
      type: 'quiz',
      id: 'midnight-teaching',
      title: '三星洞夜课',
      intro: '记住祖师敲头与闭门留下的暗示。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '祖师敲头三下，暗指什么时辰？', options: Object.freeze(['一更', '三更', '天明']), answer: 1 }),
        Object.freeze({ prompt: '祖师倒背双手入内，暗指哪条路？', options: Object.freeze(['前门', '后门', '山门']), answer: 1 }),
        Object.freeze({ prompt: '学成变化后，最重要的师嘱是什么？', options: Object.freeze(['处处显能', '不可卖弄泄师门', '只与同门争胜']), answer: 1 })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 菩提: 1 }), routes: Object.freeze({ discipline: 1 }) }),
      feedback: '你听懂了祖师未说出口的教诲'
    }),
    '0:6': Object.freeze({
      type: 'quiz',
      id: 'sea-needle',
      title: '海藏寻针',
      intro: '在龙宫兵库中找出会回应悟空的神珍。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '九股叉与方天戟都嫌轻，下一步看哪里？', options: Object.freeze(['宴席', '海藏霞光', '龙宫正门']), answer: 1 }),
        Object.freeze({ prompt: '铁柱靠近时光华更盛，说明什么？', options: Object.freeze(['正在崩裂', '认主有应', '龙王设伏']), answer: 1 }),
        Object.freeze({ prompt: '怎样确认它真能随心？', options: Object.freeze(['命它小些', '砸断珊瑚', '丢回海沟']), answer: 0 })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 龙王: 1 }), routes: Object.freeze({ insight: 1 }) }),
      feedback: '你没有毁坏兵库便找到了定海神珍'
    }),
    '1:2': Object.freeze({
      type: 'catch',
      id: 'peach-garden-catch',
      title: '蟠桃园接桃',
      intro: '随树影左右接住熟透落果，青桃留在枝头，巡园天册也不要碰。',
      prompt: '接住 9 枚熟蟠桃；青桃会扣分，碰到天册会失去一次护身。',
      theme: 'peach',
      duration: 24,
      timeLimit: 24,
      parTime: 18,
      targetScore: 9,
      lives: 3,
      spawnRate: 720,
      comboWindow: 2000,
      weights: Object.freeze({ target: 0.66, soft: 0.2, hazard: 0.14 }),
      reward: Object.freeze({ relations: Object.freeze({ 王母: 1 }), routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ peachHarvestKept: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ discipline: 1 }), flags: Object.freeze({ peachGardenMastery: true }) }),
      feedback: '你分清桃龄并护住园册，王母记下了这次稳妥的看园'
    }),
    '1:5': Object.freeze({
      type: 'battle',
      id: 'heaven-formation',
      title: '山门拒天兵',
      intro: '在花果山门前横棒迎阵，击退李靖前锋与哪吒。留意朱砂预兆，闪开重击再还手。',
      prompt: '击退两阵天兵，守住水帘洞山门。',
      encounter: 'heaven',
      playerVariant: 'great-sage',
      timeLimit: 45,
      parTime: 35,
      backdrop: 'assets/backgrounds/huaguo-heaven-siege-stage.png',
      playerArt: 'assets/characters/wukong/great-sage/defiant-portrait.png',
      playerFrames: greatSageActions,
      playerHealth: 100,
      attackPower: 20,
      assist: Object.freeze({ triggerCombo: 5, duration: 850, label: '群猴擂鼓掷石，替大王清开阵脚' }),
      waves: Object.freeze([
        Object.freeze({
          name: '托塔天王前锋阵',
          art: 'assets/characters/li-jing/command-portrait.png',
          frames: heavenSoldierActions,
          health: 52,
          damage: 12,
          speed: 6.2,
          attackRate: 1450,
          patterns: Object.freeze([
            Object.freeze({ type: 'melee', name: '长枪合刺', telegraph: 650, damage: 12, range: 18, cooldown: 720, interruptible: true }),
            Object.freeze({ type: 'projectile', name: '天矛投阵', telegraph: 720, damage: 11, speed: 46, kind: 'spear', cooldown: 860, interruptible: false })
          ])
        }),
        Object.freeze({
          name: '哪吒三太子',
          art: 'assets/characters/nezha/battle-ready-portrait.png',
          frames: nezhaActions,
          health: 72,
          damage: 16,
          speed: 7.4,
          attackRate: 1180,
          patterns: Object.freeze([
            Object.freeze({ type: 'melee', name: '火尖枪突进', telegraph: 560, damage: 16, range: 19, cooldown: 650, interruptible: true }),
            Object.freeze({ type: 'projectile', name: '风火轮回旋', telegraph: 690, damage: 15, speed: 52, kind: 'firewheel', returning: true, cooldown: 1050, interruptible: false })
          ])
        })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 群猴: 2 }), routes: Object.freeze({ bond: 1 }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ defiance: 1 }), flags: Object.freeze({ heavenBattleMastery: true }) }),
      feedback: '花果山主阵没有被天兵冲散'
    }),
    '1:6': Object.freeze({
      type: 'duel',
      id: 'seventy-two-changes',
      title: '七十二变斗法',
      intro: '读二郎真君的起手，以“攻、架、变”循环相克。架克攻，攻克变，变克架。',
      prompt: '五次交锋中赢下三手。',
      opponentName: '二郎真君',
      opponentRow: 'erlang',
      roundCount: 5,
      roundPool: Object.freeze([
        Object.freeze({ tell: '二郎肩锋前压，三尖刀蓄着直取中门的劲。', opponent: 'attack' }),
        Object.freeze({ tell: '真君忽把重心压到前足，刀锋与天眼同时锁住胸口。', opponent: 'attack' }),
        Object.freeze({ tell: '梅山鼓点骤急，二郎抢在变化成形前踏进半步。', opponent: 'attack' }),
        Object.freeze({ tell: '天眼先定住脚下，真君的架势沉稳不追。', opponent: 'guard' }),
        Object.freeze({ tell: '他横转三尖刀封住两侧，脚下没有追击的意思。', opponent: 'guard' }),
        Object.freeze({ tell: '银甲下沉，刀柄贴肋，二郎正等你先露出棒路。', opponent: 'guard' }),
        Object.freeze({ tell: '他收刀捻诀，身形边缘已经浮起鹰羽。', opponent: 'trick' }),
        Object.freeze({ tell: '天眼的光先落在云影而非悟空身上，变化已从侧面展开。', opponent: 'trick' }),
        Object.freeze({ tell: '三尖刀忽然失去实影，真君袖中的诀印才是这一手。', opponent: 'trick' })
      ]),
      rounds: Object.freeze([
        Object.freeze({ tell: '二郎肩锋前压，三尖刀蓄着直取中门的劲。', opponent: 'attack' }),
        Object.freeze({ tell: '天眼先定住脚下，真君的架势沉稳不追。', opponent: 'guard' }),
        Object.freeze({ tell: '他收刀捻诀，身形边缘已起变化。', opponent: 'trick' }),
        Object.freeze({ tell: '梅山鼓点骤急，刀尖却故意留在后手。', opponent: 'guard' }),
        Object.freeze({ tell: '金刚琢的风声压近，二郎抢在变局前突进。', opponent: 'attack' })
      ]),
      passScore: 3,
      reward: Object.freeze({ relations: Object.freeze({ 二郎: 1, 群猴: 1 }), routes: Object.freeze({ insight: 1 }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ erlangDuelMastery: true }) }),
      feedback: '二郎真君认可你的变化机锋'
    }),
    '1:7': Object.freeze({
      type: 'quiz',
      id: 'bagua-furnace',
      title: '八卦炉生门',
      intro: '辨八方火候，在四十九日丹火中留住一线生机。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '乾、坤、震、巽之间，哪一位有风？', options: Object.freeze(['乾位', '巽位', '坤位']), answer: 1 }),
        Object.freeze({ prompt: '烟涌入眼时，怎样避免被炉火逼出？', options: Object.freeze(['闭气伏低', '撞向离火', '大声求饶']), answer: 0 }),
        Object.freeze({ prompt: '炉门将开，力量该留到何时？', options: Object.freeze(['童子添火时', '炉门开启的一瞬', '第一日']), answer: 1 })
      ]),
      reward: Object.freeze({ routes: Object.freeze({ discipline: 1, insight: 1 }) }),
      feedback: '你守住巽位，熬过了最后一轮丹火'
    }),
    '3:2': Object.freeze({
      type: 'quiz',
      id: 'lift-the-seal',
      title: '揭帖开山',
      intro: '替玄奘走上峰顶，按次序揭下六字真言。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '山石摇动时，先做什么？', options: Object.freeze(['向山下示警', '立刻奔逃', '敲打石壁']), answer: 0 }),
        Object.freeze({ prompt: '揭帖前该如何处置经囊？', options: Object.freeze(['放在落石下', '系紧背负', '丢下山崖']), answer: 1 }),
        Object.freeze({ prompt: '真言离石，山体将崩，退向哪里？', options: Object.freeze(['正对裂缝', '背风高处', '最低谷底']), answer: 1 })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 1 }), routes: Object.freeze({ bond: 1 }) }),
      feedback: '你稳稳揭下压帖，师徒因缘正式开始'
    }),
    '3:4': Object.freeze({
      type: 'quiz',
      id: 'eagle-sorrow',
      title: '鹰愁涧寻龙',
      intro: '循水纹辨认白龙踪迹，避免让师父再陷险处。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '白马被吞后，水面哪处最可疑？', options: Object.freeze(['逆流旋涡', '静止浅滩', '岸边枯草']), answer: 0 }),
        Object.freeze({ prompt: '白龙只吞马不伤人，可能说明什么？', options: Object.freeze(['毫无灵智', '另有因缘', '已经逃远']), answer: 1 }),
        Object.freeze({ prompt: '悟空入水前，谁来守住玄奘？', options: Object.freeze(['无人', '土地山神并设毫毛警戒', '让玄奘独行']), answer: 1 })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 1, 白龙: 1 }), routes: Object.freeze({ insight: 1 }) }),
      feedback: '你看出白龙另有来历'
    }),
    '3:6': Object.freeze({
      type: 'battle',
      id: 'black-wind-battle',
      title: '黑风洞夺袈裟',
      intro: '黑熊精枪沉力猛。逼近时看准预兆闪身，抢在他收枪前夺回袈裟。',
      prompt: '破开黑风洞两重守势。',
      encounter: 'black-wind',
      playerVariant: 'pilgrim-circlet',
      timeLimit: 45,
      parTime: 35,
      backdrop: 'assets/backgrounds/guanyin-monastery-night-stage.png',
      playerArt: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      playerFrames: pilgrimWukongActions,
      playerHealth: 100,
      attackPower: 18,
      waves: Object.freeze([
        Object.freeze({
          name: '黑风洞巡山阵',
          art: 'assets/characters/black-bear-bust-neutral.png',
          frames: blackBearActions,
          health: 48,
          damage: 13,
          speed: 5.8,
          attackRate: 1500,
          tone: 'shadow',
          patterns: Object.freeze([
            Object.freeze({ type: 'melee', name: '黑缨枪点刺', telegraph: 690, damage: 13, range: 18, cooldown: 780, interruptible: true }),
            Object.freeze({ type: 'feint', name: '黑风虚枪', telegraph: 610, followup: 310, damage: 14, range: 20, cooldown: 900, interruptible: true })
          ])
        }),
        Object.freeze({
          name: '黑熊精 · 黑缨枪',
          art: 'assets/characters/black-bear.png',
          frames: blackBearActions,
          health: 78,
          damage: 18,
          speed: 6.8,
          attackRate: 1250,
          tone: 'iron',
          patterns: Object.freeze([
            Object.freeze({ type: 'feint', name: '卷洞黑风', telegraph: 560, followup: 250, damage: 17, range: 21, cooldown: 780, interruptible: true }),
            Object.freeze({ type: 'melee', name: '沉枪压顶', telegraph: 760, damage: 19, range: 20, cooldown: 880, interruptible: true })
          ])
        })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 1, 观音: 1 }), routes: Object.freeze({ discipline: 1 }), flags: Object.freeze({ blackWindRecovered: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ blackWindMastery: true }) }),
      feedback: '你稳住黑风枪势夺回袈裟，也知道了何时该请观音收局'
    }),
    '4:7': Object.freeze({
      type: 'quiz',
      id: 'white-bone-discernment',
      title: '火眼辨三变',
      intro: '不要只追着人形出棒，从三次变化留下的破绽中锁住白骨真身。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '荒岭无人家，送斋村姑却独自近前，先查什么？', options: Object.freeze(['立刻接过斋饭', '看足下痕迹与篮中妖气', '只问她姓甚名谁']), answer: 1, success: '足迹与斋饭的妖气对不上村姑身份，第一层皮囊露出破绽。' }),
        Object.freeze({ prompt: '第一棒后地上留下假尸，一缕白光正贴地遁走，怎样追？', options: Object.freeze(['守住假尸不动', '循离体白光追真魂', '责问玄奘为何不信']), answer: 1, success: '你没有被假尸拖住，火眼始终咬住遁走的真魂。' }),
        Object.freeze({ prompt: '老翁持杖来认亲，三张面孔的妖气已经重合，此刻先做什么？', options: Object.freeze(['先定住真身并说出证据', '闭眼听哭诉', '离队让众人自辨']), answer: 0, success: '三次破绽连成完整证据，最后一层变化再难混淆。' })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 1 }), routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ whiteBoneDiscerned: true }) }),
      feedback: '你把三次破绽说清，玄奘虽仍难接受杀伐，却看见了证据'
    }),
    '5:5': Object.freeze({
      type: 'battle',
      id: 'samadhi-fire',
      title: '火云洞破阵',
      intro: '三昧火会在出手前染红地面。横移避开火路，趁红孩儿换气时近身。',
      prompt: '破两重火阵并保住火眼。',
      encounter: 'samadhi-fire',
      playerVariant: 'pilgrim-circlet',
      timeLimit: 45,
      parTime: 35,
      backdrop: 'assets/backgrounds/fire-stage.png',
      playerArt: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      playerFrames: pilgrimWukongActions,
      playerHealth: 92,
      attackPower: 17,
      waves: Object.freeze([
        Object.freeze({
          name: '五行车火阵',
          art: 'assets/characters/red-boy-bust-defiant.png',
          frames: redBoyActions,
          health: 56,
          damage: 15,
          speed: 5.9,
          attackRate: 1420,
          tone: 'flame',
          patterns: Object.freeze([
            Object.freeze({ type: 'lane', name: '五行车火路', telegraph: 820, damage: 15, width: 27, cooldown: 760, interruptible: false }),
            Object.freeze({ type: 'projectile', name: '丈八火尖', telegraph: 650, damage: 13, speed: 48, kind: 'flame', cooldown: 760, interruptible: false })
          ])
        }),
        Object.freeze({
          name: '红孩儿 · 三昧真火',
          art: 'assets/characters/red-boy-bust-defiant.png',
          frames: redBoyActions,
          health: 82,
          damage: 20,
          speed: 7.2,
          attackRate: 1120,
          tone: 'flame',
          patterns: Object.freeze([
            Object.freeze({ type: 'lane', name: '三昧火连路', telegraph: 690, damage: 20, width: 29, cooldown: 620, interruptible: false }),
            Object.freeze({ type: 'melee', name: '换气突枪', telegraph: 620, damage: 17, range: 19, cooldown: 900, interruptible: true })
          ])
        })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 观音: 1, 玄奘: 1 }), routes: Object.freeze({ discipline: 1, insight: 1 }), flags: Object.freeze({ samadhiFireRead: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ discipline: 1 }), flags: Object.freeze({ samadhiFireMastery: true }) }),
      feedback: '你没有把负伤变成逞强，观音认可你辨清火势后求援'
    }),
    '6:7': Object.freeze({
      type: 'duel',
      id: 'six-ear-proof',
      title: '真假行者验痕',
      intro: '六耳连起手都学得一模一样。用“攻、架、变”逼他在五次交锋中露出抢拍。',
      prompt: '五次交锋中赢下三手。',
      opponentName: '六耳猕猴',
      opponentRow: 'wukong',
      roundCount: 5,
      roundPool: Object.freeze([
        Object.freeze({ tell: '假行者抢先抬腕，像要用你的旧脾气硬攻。', opponent: 'attack' }),
        Object.freeze({ tell: '六耳把棒头压低，听见风声便抢着直取中门。', opponent: 'attack' }),
        Object.freeze({ tell: '他刻意学大闹天宫时的前倾步，棒势已经先于变化落下。', opponent: 'attack' }),
        Object.freeze({ tell: '他把棒横在胸前，却始终盯着你的毫毛。', opponent: 'guard' }),
        Object.freeze({ tell: '紧箍咒声响起，他等着你先乱，架势反而收紧。', opponent: 'guard' }),
        Object.freeze({ tell: '六耳退到师父视线前，横棒摆出一副只守不追的样子。', opponent: 'guard' }),
        Object.freeze({ tell: '两个身影同时虚晃，六耳先去听旁人的惊呼。', opponent: 'trick' }),
        Object.freeze({ tell: '他耳廓轻转去收三界回声，脚下真身却已经变空。', opponent: 'trick' }),
        Object.freeze({ tell: '假行者的棒影没有重量，真正动作藏在你看不见的另一侧。', opponent: 'trick' })
      ]),
      rounds: Object.freeze([
        Object.freeze({ tell: '假行者抢先抬腕，像要用你的旧脾气硬攻。', opponent: 'attack' }),
        Object.freeze({ tell: '他把棒横在胸前，却始终盯着你的毫毛。', opponent: 'guard' }),
        Object.freeze({ tell: '两个身影同时虚晃，六耳先去听旁人的惊呼。', opponent: 'trick' }),
        Object.freeze({ tell: '紧箍咒声响起，他等着你先乱，架势反而收紧。', opponent: 'guard' }),
        Object.freeze({ tell: '到灵山门前，六耳急着用最后一棒定真假。', opponent: 'attack' })
      ]),
      passScore: 3,
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 2 }), routes: Object.freeze({ bond: 1, insight: 1 }), flags: Object.freeze({ sixEarDiscerned: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ bond: 1 }), flags: Object.freeze({ sixEarDuelMastery: true }) }),
      feedback: '你用共同经历而非胜负辨真，玄奘重新抓住了信任的依据'
    }),
    '7:2': Object.freeze({
      type: 'battle',
      id: 'bull-demon-battle',
      title: '翠云山决战',
      intro: '牛魔王力沉且会突然现出本相。与八戒守住两侧，闪过混铁棍再抢回真扇。',
      prompt: '击破牛魔王两种战形。',
      encounter: 'bull-demon',
      playerVariant: 'pilgrim-circlet',
      timeLimit: 45,
      parTime: 35,
      backdrop: 'assets/backgrounds/fire-stage.png',
      playerArt: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      playerFrames: pilgrimWukongActions,
      playerHealth: 108,
      attackPower: 19,
      assist: Object.freeze({ triggerCounters: 2, duration: 1050, label: '八戒横耙封住退路，牛魔王一时转身不得' }),
      waves: Object.freeze([
        Object.freeze({
          name: '牛魔王 · 混铁棍',
          art: 'assets/characters/bull-demon-bust-angry.png',
          frames: bullWarriorActions,
          health: 66,
          damage: 18,
          speed: 6.1,
          attackRate: 1380,
          tone: 'iron',
          patterns: Object.freeze([
            Object.freeze({ type: 'melee', name: '混铁棍横扫', telegraph: 670, damage: 18, range: 21, cooldown: 760, interruptible: true }),
            Object.freeze({ type: 'slam', name: '震地棍', telegraph: 820, damage: 20, range: 100, cooldown: 980, interruptible: false })
          ])
        }),
        Object.freeze({
          name: '大力牛魔王本相',
          art: 'assets/characters/bull-demon-bust-angry.png',
          frames: bullTrueFormActions,
          health: 92,
          damage: 23,
          speed: 7.1,
          attackRate: 1080,
          tone: 'flame',
          patterns: Object.freeze([
            Object.freeze({ type: 'charge', name: '本相冲阵', telegraph: 760, damage: 23, speed: 112, duration: 760, stun: 1100, cooldown: 950, interruptible: false }),
            Object.freeze({ type: 'slam', name: '双角震山', telegraph: 720, damage: 21, range: 100, cooldown: 820, interruptible: false }),
            Object.freeze({ type: 'melee', name: '回身挑角', telegraph: 590, damage: 19, range: 20, cooldown: 680, interruptible: true })
          ])
        })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 八戒: 2, 牛魔: 1 }), routes: Object.freeze({ bond: 1, discipline: 1 }), flags: Object.freeze({ bullBattleHeld: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ bond: 1 }), flags: Object.freeze({ bullBattleMastery: true }) }),
      feedback: '你与八戒合住阵脚，牛魔王也承认这一战并非只靠蛮力'
    }),
    '7:3': Object.freeze({
      type: 'quiz',
      id: 'plantain-fan-rhythm',
      title: '三扇定火脉',
      intro: '依铁扇所授次序落扇，让火息、风生、雨降，不让余焰回卷山民。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '第一扇落下，应先压住哪一种变化？', options: Object.freeze(['令山火熄灭', '立刻催雨', '卷走行李']), answer: 0, success: '第一扇压住火头，八百里焦焰终于低伏。' }),
        Object.freeze({ prompt: '火头已低，第二扇该引出什么？', options: Object.freeze(['让火复燃', '生风清开热气', '封住山路']), answer: 1, success: '第二扇生风，积在山谷的热气沿空路散开。' }),
        Object.freeze({ prompt: '余烬仍烫，第三扇怎样收尾？', options: Object.freeze(['降雨冷透火根', '只吹向村舍', '收扇立即离开']), answer: 0, success: '第三扇带雨落下，火根冷透，山道才真正能走。' })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 铁扇: 1, 玄奘: 1 }), routes: Object.freeze({ discipline: 1 }), flags: Object.freeze({ plantainRhythmKept: true }) }),
      feedback: '你按三扇次序熄透火根，铁扇认可你没有拿山民试扇'
    }),
    '7:8': Object.freeze({
      type: 'catch',
      id: 'spider-web-breaks',
      title: '盘丝洞寻隙',
      intro: '白丝层层落下，只有金色破绽能通向师父。接住破绽，避开收紧的蛛网。',
      prompt: '接住 8 处破绽；碰到蛛网会失去一次护身。',
      theme: 'web',
      backdrop: 'assets/backgrounds/pansi-stage.png',
      duration: 22,
      timeLimit: 22,
      parTime: 16,
      targetScore: 8,
      lives: 3,
      spawnRate: 690,
      comboWindow: 2000,
      weights: Object.freeze({ target: 0.68, soft: 0, hazard: 0.32 }),
      reward: Object.freeze({ relations: Object.freeze({ 玄奘: 1, 八戒: 1 }), routes: Object.freeze({ insight: 1, bond: 1 }), flags: Object.freeze({ spiderWebRead: true }) }),
      masteryReward: Object.freeze({ routes: Object.freeze({ insight: 1 }), flags: Object.freeze({ spiderWebMastery: true }) }),
      feedback: '你沿蛛丝受力的破绽开路，没有让八戒再独自陷进网中'
    }),
    '8:7': Object.freeze({
      type: 'quiz',
      id: 'scripture-rescue',
      title: '晒石抢经',
      intro: '经担落水后纸页相黏，在不毁墨迹的前提下抢救受湿真经。',
      rounds: Object.freeze([
        Object.freeze({ prompt: '经卷刚从水中捞起，第一步怎样减少继续渗损？', options: Object.freeze(['整捆堆在一起', '分卷平放并吸去浮水', '用力拧干']), answer: 1, success: '经卷被迅速分开，积水没有继续泡透内层。' }),
        Object.freeze({ prompt: '湿页彼此粘连，怎样揭页最不易撕去经文？', options: Object.freeze(['从干松边缘缓缓分离', '抓住页心猛扯', '靠近明火烘卷']), answer: 0, success: '你从松开的页边慢慢揭分，保住大半墨迹。' }),
        Object.freeze({ prompt: '晒石上仍有一页粘破，归东土前该如何处置？', options: Object.freeze(['藏起残页只报圆满', '如实记下缺损并护存残片', '重抄后丢掉原页']), answer: 1, success: '残片与缺损一同入册，圆满没有靠隐瞒裂口成立。' })
      ]),
      reward: Object.freeze({ relations: Object.freeze({ 悟净: 2, 玄奘: 1 }), routes: Object.freeze({ insight: 1, discipline: 1 }), flags: Object.freeze({ scriptureRescued: true }) }),
      feedback: '你保住大半湿经并如实登记残页，悟净认可这份谨慎'
    })
  });

  const periodArt = Object.freeze({
    '0:0': Object.freeze({ 石猴: 'assets/characters/wukong/stone-child/neutral.png' }),
    '0:1': Object.freeze({ 石猴: 'assets/characters/wukong/stone-child/determined.png' }),
    '0:2': Object.freeze({ 石猴: 'assets/characters/wukong/stone-child/thoughtful.png' }),
    '0:3': Object.freeze({ 石猴: 'assets/characters/wukong/disciple-no-circlet/humble.png' }),
    '0:4': Object.freeze({ 石猴: 'assets/characters/wukong/disciple-no-circlet/neutral.png' }),
    '0:5': Object.freeze({ 悟空: 'assets/characters/wukong/disciple-no-circlet/alert.png' }),
    '0:6': Object.freeze({ 悟空: 'assets/characters/wukong/monkey-king-no-circlet/determined.png' }),
    '0:7': Object.freeze({ 悟空: 'assets/characters/wukong/monkey-king-no-circlet/determined.png' }),
    '0:8': Object.freeze({ 悟空: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png' }),
    '1:0': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '1:1': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/neutral-portrait.png' }),
    '1:2': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/neutral-portrait.png' }),
    '1:3': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '1:4': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '1:5': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '1:6': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '1:7': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/neutral-portrait.png' }),
    '1:8': Object.freeze({ 悟空: 'assets/characters/wukong/great-sage/defiant-portrait.png' }),
    '2:0': Object.freeze({ 悟空: 'assets/characters/wukong-imprisoned.png' }),
    '2:5': Object.freeze({ 唐王: 'assets/characters/tang-emperor/court-worried.png', 魏征: 'assets/characters/wei-zheng/dream-duty-stern-portrait.png' }),
    '2:6': Object.freeze({ 唐王: 'assets/characters/tang-emperor/court-worried.png', 魏征: 'assets/characters/wei-zheng/dream-duty-stern-portrait.png' }),
    '3:1': Object.freeze({ 悟空: 'assets/characters/wukong-imprisoned.png' }),
    '3:2': Object.freeze({ 悟空: 'assets/characters/wukong/mountain-prison-no-circlet/relieved.png' }),
    '3:3': Object.freeze({ 悟空: Object.freeze({ beforeFlag: 'assets/characters/wukong/mountain-prison-no-circlet/relieved.png', flag: 'filletWorn', afterFlag: 'assets/characters/wukong-released.png' }) }),
    '3:4': Object.freeze({ 悟空: 'assets/characters/wukong-released.png', 白龙: 'assets/characters/white-dragon/eagle-sorrow-defiant-portrait.png' }),
    '3:5': Object.freeze({ 金池: 'assets/characters/jinchi/relic-greed-portrait.png' }),
    '4:5': Object.freeze({ 镇元: 'assets/characters/zhenyuan/tree-fallen-stern-portrait.png' }),
    '4:6': Object.freeze({ 镇元: 'assets/characters/zhenyuan/tree-fallen-stern-portrait.png' }),
    '6:5': Object.freeze({ 女王: 'assets/characters/daughter-queen/farewell-tender-portrait.png' }),
    '6:7': Object.freeze({ 六耳: 'assets/characters/six-eared/impostor-sly-portrait.png' }),
    '8:7': Object.freeze({ 老鼋: 'assets/characters/old-turtle/promise-broken-angry-portrait.png' })
  });

  const pilgrimPerformance = Object.freeze({
    悟空: Object.freeze({
      angry: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      determined: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      strike: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      advance: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      guard: 'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
      pained: 'assets/characters/wukong/pilgrim-circlet/pained-recoil.png',
      worried: 'assets/characters/wukong/pilgrim-circlet/pained-recoil.png',
      recoil: 'assets/characters/wukong/pilgrim-circlet/pained-recoil.png',
      thoughtful: 'assets/characters/wukong/pilgrim-circlet/thoughtful.png',
      sly: 'assets/characters/wukong/pilgrim-circlet/thoughtful.png',
      calm: 'assets/characters/wukong/pilgrim-circlet/thoughtful.png',
      consider: 'assets/characters/wukong/pilgrim-circlet/thoughtful.png',
      default: 'assets/characters/wukong-released.png'
    }),
    玄奘: Object.freeze({
      angry: 'assets/characters/tang/pilgrim/stern.png',
      determined: 'assets/characters/tang/pilgrim/stern.png',
      strike: 'assets/characters/tang/pilgrim/stern.png',
      advance: 'assets/characters/tang/pilgrim/stern.png',
      worried: 'assets/characters/tang/pilgrim/worried.png',
      pained: 'assets/characters/tang/pilgrim/worried.png',
      recoil: 'assets/characters/tang/pilgrim/worried.png',
      guard: 'assets/characters/tang/pilgrim/worried.png',
      thoughtful: 'assets/characters/tang/pilgrim/worried.png',
      consider: 'assets/characters/tang/pilgrim/worried.png',
      relieved: 'assets/characters/tang/pilgrim/relieved.png',
      calm: 'assets/characters/tang/pilgrim/relieved.png',
      celebrate: 'assets/characters/tang/pilgrim/relieved.png',
      bow: 'assets/characters/tang/pilgrim/relieved.png',
      default: 'assets/characters/tang/pilgrim/stern.png'
    }),
    八戒: Object.freeze({
      relieved: 'assets/characters/bajie/pilgrim/cheerful.png',
      calm: 'assets/characters/bajie/pilgrim/cheerful.png',
      celebrate: 'assets/characters/bajie/pilgrim/cheerful.png',
      angry: 'assets/characters/bajie/pilgrim/protective.png',
      determined: 'assets/characters/bajie/pilgrim/protective.png',
      strike: 'assets/characters/bajie/pilgrim/protective.png',
      guard: 'assets/characters/bajie/pilgrim/protective.png',
      advance: 'assets/characters/bajie/pilgrim/protective.png',
      worried: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      pained: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      recoil: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      thoughtful: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      sly: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      consider: 'assets/characters/bajie/pilgrim/worried-portrait.png',
      default: 'assets/characters/bajie/pilgrim/cheerful.png'
    }),
    悟净: Object.freeze({
      angry: 'assets/characters/sha/pilgrim/guard.png',
      determined: 'assets/characters/sha/pilgrim/guard.png',
      strike: 'assets/characters/sha/pilgrim/guard.png',
      guard: 'assets/characters/sha/pilgrim/guard.png',
      advance: 'assets/characters/sha/pilgrim/guard.png',
      thoughtful: 'assets/characters/sha/pilgrim/thoughtful-portrait.png',
      calm: 'assets/characters/sha/pilgrim/thoughtful-portrait.png',
      consider: 'assets/characters/sha/pilgrim/thoughtful-portrait.png',
      relieved: 'assets/characters/sha/pilgrim/thoughtful-portrait.png',
      worried: 'assets/characters/sha/pilgrim/wounded.png',
      pained: 'assets/characters/sha/pilgrim/wounded.png',
      recoil: 'assets/characters/sha/pilgrim/wounded.png',
      default: 'assets/characters/sha/pilgrim/guard.png'
    })
  });

  // The four pilgrims enter at different points, so period art never leaks into an earlier scene.
  const journeyPerformanceArt = Object.freeze(Object.fromEntries(Array.from({ length: 54 }, (_, offset) => {
    const sceneIndex = 27 + offset;
    const key = `${Math.floor(sceneIndex / 9)}:${sceneIndex % 9}`;
    const performers = { 玄奘: pilgrimPerformance.玄奘 };
    if (sceneIndex >= 31) performers.悟空 = pilgrimPerformance.悟空;
    if (sceneIndex >= 34) performers.八戒 = pilgrimPerformance.八戒;
    if (sceneIndex >= 37) performers.悟净 = pilgrimPerformance.悟净;
    return [key, Object.freeze(performers)];
  })));

  const performanceArt = Object.freeze({
    '0:0': Object.freeze({ 石猴: Object.freeze({ thoughtful: 'assets/characters/wukong/stone-child/thoughtful.png', determined: 'assets/characters/wukong/stone-child/determined.png', default: 'assets/characters/wukong/stone-child/neutral.png' }) }),
    '0:1': Object.freeze({ 石猴: Object.freeze({ thoughtful: 'assets/characters/wukong/stone-child/thoughtful.png', determined: 'assets/characters/wukong/stone-child/determined.png', strike: 'assets/characters/wukong/stone-child/determined.png', default: 'assets/characters/wukong/stone-child/neutral.png' }) }),
    '0:2': Object.freeze({ 石猴: Object.freeze({ thoughtful: 'assets/characters/wukong/stone-child/thoughtful.png', determined: 'assets/characters/wukong/stone-child/determined.png', default: 'assets/characters/wukong/stone-child/thoughtful.png' }) }),
    '0:3': Object.freeze({ 石猴: Object.freeze({ bow: 'assets/characters/wukong/disciple-no-circlet/humble.png', thoughtful: 'assets/characters/wukong/disciple-no-circlet/neutral.png', default: 'assets/characters/wukong/disciple-no-circlet/humble.png' }) }),
    '0:4': Object.freeze({ 石猴: Object.freeze({ bow: 'assets/characters/wukong/disciple-no-circlet/humble.png', default: 'assets/characters/wukong/disciple-no-circlet/neutral.png' }) }),
    '0:5': Object.freeze({ 悟空: Object.freeze({ worried: 'assets/characters/wukong/disciple-no-circlet/humble.png', thoughtful: 'assets/characters/wukong/disciple-no-circlet/neutral.png', default: 'assets/characters/wukong/disciple-no-circlet/alert.png' }) }),
    '0:6': Object.freeze({ 悟空: Object.freeze({ calm: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png', thoughtful: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png', determined: 'assets/characters/wukong/monkey-king-no-circlet/determined.png', strike: 'assets/characters/wukong/monkey-king-no-circlet/determined.png', default: 'assets/characters/wukong/monkey-king-no-circlet/determined.png' }) }),
    '0:7': Object.freeze({ 悟空: Object.freeze({ thoughtful: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png', default: 'assets/characters/wukong/monkey-king-no-circlet/determined.png' }) }),
    '0:8': Object.freeze({ 悟空: Object.freeze({ calm: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png', thoughtful: 'assets/characters/wukong/monkey-king-no-circlet/neutral.png', default: 'assets/characters/wukong/monkey-king-no-circlet/determined.png' }) }),
    '1:0': Object.freeze({ 悟空: Object.freeze({ calm: 'assets/characters/wukong/great-sage/neutral-portrait.png', thoughtful: 'assets/characters/wukong/great-sage/neutral-portrait.png', default: 'assets/characters/wukong/great-sage/defiant-portrait.png' }) }),
    '1:1': Object.freeze({ 悟空: Object.freeze({ angry: 'assets/characters/wukong/great-sage/defiant-portrait.png', determined: 'assets/characters/wukong/great-sage/defiant-portrait.png', default: 'assets/characters/wukong/great-sage/neutral-portrait.png' }) }),
    '1:2': Object.freeze({ 悟空: Object.freeze({ determined: 'assets/characters/wukong/great-sage/defiant-portrait.png', default: 'assets/characters/wukong/great-sage/neutral-portrait.png' }) }),
    '1:3': Object.freeze({ 悟空: Object.freeze({ thoughtful: 'assets/characters/wukong/great-sage/neutral-portrait.png', default: 'assets/characters/wukong/great-sage/defiant-portrait.png' }) }),
    '1:4': Object.freeze({ 悟空: Object.freeze({ thoughtful: 'assets/characters/wukong/great-sage/neutral-portrait.png', default: 'assets/characters/wukong/great-sage/defiant-portrait.png' }) }),
    '1:5': Object.freeze({ 悟空: Object.freeze({ worried: 'assets/characters/wukong/great-sage/neutral-portrait.png', default: 'assets/characters/wukong/great-sage/defiant-portrait.png' }) }),
    '1:6': Object.freeze({ 悟空: Object.freeze({ thoughtful: 'assets/characters/wukong/great-sage/neutral-portrait.png', default: 'assets/characters/wukong/great-sage/defiant-portrait.png' }) }),
    '1:7': Object.freeze({ 悟空: Object.freeze({ determined: 'assets/characters/wukong/great-sage/defiant-portrait.png', default: 'assets/characters/wukong/great-sage/neutral-portrait.png' }) }),
    ...journeyPerformanceArt
  });

  const sceneBackdrops = Object.freeze({
    '0:0': 'assets/backgrounds/huaguo-birth-stage.png',
    '0:1': 'assets/backgrounds/water-curtain-cave-stage.png',
    '0:2': 'assets/backgrounds/water-curtain-cave-stage.png',
    '0:3': 'assets/backgrounds/fangcun-sanxing-stage.png',
    '0:4': 'assets/backgrounds/fangcun-sanxing-stage.png',
    '0:5': 'assets/backgrounds/fangcun-sanxing-stage.png',
    '0:6': 'assets/backgrounds/east-sea-dragon-palace-stage.png',
    '0:7': 'assets/backgrounds/underworld-ledger-hall-stage.png',
    '0:8': 'assets/backgrounds/heavenly-stable-stage.png',
    '1:0': 'assets/backgrounds/huaguo-heaven-siege-stage.png',
    '1:1': 'assets/backgrounds/heavenly-stable-stage.png',
    '1:2': 'assets/backgrounds/peach-garden-stage.png',
    '1:3': 'assets/backgrounds/jade-pool-banquet-stage.png',
    '1:4': 'assets/backgrounds/tushita-furnace-stage.png',
    '1:5': 'assets/backgrounds/huaguo-heaven-siege-stage.png',
    '1:6': 'assets/backgrounds/huaguo-heaven-siege-stage.png',
    '1:7': 'assets/backgrounds/tushita-furnace-stage.png',
    '1:8': 'assets/backgrounds/wuxing-stage.png',
    '2:5': 'assets/backgrounds/changan-imperial-court-stage.png',
    '2:6': 'assets/backgrounds/underworld-ledger-hall-stage.png',
    '2:7': 'assets/backgrounds/changan-departure.png',
    '2:8': 'assets/backgrounds/changan-departure.png',
    '3:1': 'assets/backgrounds/wuxing-stage.png',
    '3:2': 'assets/backgrounds/wuxing-stage.png',
    '3:3': 'assets/backgrounds/wuxing-stage.png',
    '3:4': 'assets/backgrounds/eagle-sorrow-stage.png',
    '3:5': 'assets/backgrounds/guanyin-monastery-night-stage.png',
    '4:5': 'assets/backgrounds/wuzhuang-fallen-tree-stage.png',
    '4:6': 'assets/backgrounds/wuzhuang-fallen-tree-stage.png',
    '4:7': 'assets/backgrounds/baigu-ridge-village-stage.png',
    '4:8': 'assets/backgrounds/baigu-ridge-village-stage.png',
    '5:0': 'assets/backgrounds/baoxiang-moon-palace-stage.png',
    '5:1': 'assets/backgrounds/baoxiang-moon-palace-stage.png',
    '5:2': 'assets/backgrounds/lotus-cave-stage.png',
    '5:3': 'assets/backgrounds/wuji-garden-well-stage.png',
    '6:5': 'assets/backgrounds/daughter-stage.png',
    '6:7': 'assets/backgrounds/huaguo-heaven-siege-stage.png',
    '8:7': 'assets/backgrounds/tongtian-stage.png'
  });

  const transitionArt = Object.freeze({
    '0:7': 'assets/transitions/dragon-palace-fury.png',
    '1:0': 'assets/transitions/qitian-dasheng-reveal.png'
  });

  const castOverrides = Object.freeze({
    '0:1': Object.freeze(['石猴', '群猴']),
    '0:2': Object.freeze(['石猴', '群猴']),
    '0:6': Object.freeze(['悟空', '龙王']),
    '0:7': Object.freeze(['悟空', '阎王']),
    '0:8': Object.freeze(['悟空', '太白']),
    '1:1': Object.freeze(['悟空', '太白']),
    '1:2': Object.freeze(['悟空', '王母']),
    '1:3': Object.freeze(['悟空', '王母']),
    '1:4': Object.freeze(['悟空', '老君']),
    '1:5': Object.freeze(['悟空', '哪吒']),
    '1:6': Object.freeze(['悟空', '二郎']),
    '1:7': Object.freeze(['悟空', '老君']),
    '1:8': Object.freeze(['悟空', '如来']),
    '2:5': Object.freeze(['唐王', '魏征']),
    '2:6': Object.freeze(['唐王', '魏征']),
    '3:4': Object.freeze(['悟空', '白龙']),
    '3:5': Object.freeze(['悟空', '金池']),
    '4:1': Object.freeze(['悟空', '八戒']),
    '4:3': Object.freeze(['悟空', '八戒']),
    '4:5': Object.freeze(['悟空', '镇元']),
    '4:6': Object.freeze(['悟空', '镇元']),
    '5:4': Object.freeze(['悟空', '红孩']),
    '6:1': Object.freeze(['悟空', '八戒']),
    '6:4': Object.freeze(['悟空', '八戒']),
    '6:5': Object.freeze(['悟空', '女王']),
    '6:7': Object.freeze(['悟空', '六耳']),
    '7:2': Object.freeze(['悟空', '牛魔']),
    '7:5': Object.freeze(['悟空', '玄奘']),
    '8:2': Object.freeze(['悟空', '玄奘']),
    '8:7': Object.freeze(['悟空', '老鼋'])
  });

  const storyQuizKeys = new Set(['0:0', '0:1', '0:4', '0:5', '3:3', '4:7', '5:4', '7:3', '8:7']);
  const publishedMiniGames = Object.freeze(Object.fromEntries(Object.entries(miniGames).map(([key, game]) => {
    if (game.type !== 'quiz') return [key, game];
    return [key, Object.freeze({
      ...game,
      rounds: Object.freeze(game.rounds.slice(0, 1)),
      passScore: 1,
      placement: storyQuizKeys.has(key) ? 'story' : 'off'
    })];
  })));

  const relationDefaults = Object.freeze(Object.fromEntries(Object.keys(characterInfo).concat([
    '玄奘', '八戒', '悟净', '妖', '菩提', '观音', '如来', '白骨', '红孩', '铁扇', '牛魔'
  ]).map(character => [character, 0])));

  window.shadowplayBranchData = Object.freeze({
    version: 1,
    characterInfo,
    sceneChoices,
    branchEchoes,
    sceneScripts,
    miniGames: publishedMiniGames,
    periodArt,
    performanceArt,
    sceneBackdrops,
    transitionArt,
    castOverrides,
    relationDefaults,
    routeDefaults: Object.freeze({ defiance: 0, bond: 0, discipline: 0, insight: 0 })
  });
})();
