import { useState, useCallback, useRef, useEffect } from "react";

const HEXAGRAMS = [
  { num: 1, name: "乾", title: "乾為天", meaning: "剛健中正，自強不息", judgement: "元亨利貞。", image: "天行健，君子以自強不息。", vernacular: "萬事起始、亨通順暢、有利發展、守持正道方能長久。天體運行剛健不止，人應效法天道，奮發圖強，永不停歇。此卦為純陽至剛之象，問事大吉，但須警惕盛極必衰。" },
  { num: 2, name: "坤", title: "坤為地", meaning: "厚德載物，順承天道", judgement: "元亨，利牝馬之貞。", image: "地勢坤，君子以厚德載物。", vernacular: "大地廣闊承載萬物，柔順而有力量。如母馬般堅貞守正，方能亨通。不宜主動出擊，宜順應時勢，以包容厚德待人處事。先迷失方向，後能找到引導，利於向西南方發展。" },
  { num: 3, name: "屯", title: "水雷屯", meaning: "萬物始生，艱難初創", judgement: "元亨利貞，勿用有攸往。", image: "雲雷屯，君子以經綸。", vernacular: "如草木初生破土，雖有亨通之機，但起步艱難。此時不宜急於遠行或冒進，應先鞏固基礎、整頓內部。適合建立根基、尋找合作夥伴，耐心等待時機成熟再行動。" },
  { num: 4, name: "蒙", title: "山水蒙", meaning: "啟蒙養正，以果行育德", judgement: "亨。匪我求童蒙，童蒙求我。", image: "山下出泉，蒙。君子以果行育德。", vernacular: "如幼童矇昧未開，需要啟發教導。不是老師去求學生，而是學生主動求教才能有效。初次占問會得到答案，反覆追問則不靈驗。提醒你：承認自己不懂，虛心求教，才是成長的開始。" },
  { num: 5, name: "需", title: "水天需", meaning: "守正待時，蓄養實力", judgement: "有孚，光亨，貞吉。", image: "雲上於天，需。君子以飲食宴樂。", vernacular: "烏雲聚於天上，雨還沒落下——時機未到，需要等待。但這不是消極等待，而是在等待中充實自己、保持信念。心懷誠信就能亨通順利，適合養精蓄銳，從容應對即將來臨的機會。" },
  { num: 6, name: "訟", title: "天水訟", meaning: "天與水違行，慎謀退守", judgement: "有孚窒惕，中吉，終凶。", image: "天與水違行，訟。君子以作事謀始。", vernacular: "天往上、水往下，方向相反，產生爭訟衝突。雖然你有道理，但爭執到底反而不利。中途停止、適可而止是吉利的，硬要爭到最後則凶。凡事在開始前就要想清楚，預防糾紛比解決糾紛重要。" },
  { num: 7, name: "師", title: "地水師", meaning: "行險而順，出師有名", judgement: "貞，丈人吉，無咎。", image: "地中有水，師。君子以容民畜眾。", vernacular: "地下蘊藏著水，象徵潛在的力量和群眾。出師征戰必須有正當理由，由德高望重之人統帥才能吉利。做任何大事都需要紀律和正當性，有組織、有領導、師出有名，方能成功。" },
  { num: 8, name: "比", title: "水地比", meaning: "親附和合，擇善而從", judgement: "吉。原筮元永貞，無咎。", image: "地上有水，比。先王以建萬國，親諸侯。", vernacular: "水在地上流動匯聚，象徵親近團結。吉利之象，但要慎選你親近的對象。具備恆久的正直品德，才不會有過失。遲來的人會有凶險——提醒你及時做出選擇，不要猶豫不決。" },
  { num: 9, name: "小畜", title: "風天小畜", meaning: "以柔蓄剛，密雲不雨", judgement: "亨。密雲不雨，自我西郊。", image: "風行天上，小畜。君子以懿文德。", vernacular: "烏雲密布卻還沒下雨——力量正在蓄積但尚未釋放。目前只能做小規模的積累，大事還無法推動。適合在文化修養、內在品德上下功夫，以柔克剛，用軟實力慢慢影響局面。" },
  { num: 10, name: "履", title: "天澤履", meaning: "如履虎尾，循禮而行", judgement: "履虎尾，不咥人，亨。", image: "上天下澤，履。君子以辨上下，定民志。", vernacular: "踩到老虎尾巴卻沒被咬——處於危險境地但因為態度恭敬、行為合禮而化險為夷。提醒你在面對強勢對象或危險局面時，保持謙遜禮貌，知分寸、守本分，就能安然通過。" },
  { num: 11, name: "泰", title: "地天泰", meaning: "天地交通，萬物亨通", judgement: "小往大來，吉亨。", image: "天地交，泰。后以財成天地之道。", vernacular: "天地之氣相互交融，萬物生長繁榮——這是最好的時機。付出小的代價能得到大的回報，一切順利亨通。但要記住泰極否來，好運之中要未雨綢繆，居安思危。" },
  { num: 12, name: "否", title: "天地否", meaning: "天地不交，閉塞不通", judgement: "否之匪人，不利君子貞。", image: "天地不交，否。君子以儉德辟難。", vernacular: "天地之氣不交流，萬物不生——閉塞不通的時期。小人得勢，君子受阻。此時不宜強行推進任何事，應該收斂鋒芒、節儉度日、保存實力。否極泰來，耐心等待轉機。" },
  { num: 13, name: "同人", title: "天火同人", meaning: "與人和同，志同道合", judgement: "同人于野，亨。利涉大川。", image: "天與火，同人。君子以類族辨物。", vernacular: "在開闊的原野上與人團結一心——走出小圈子，以大公無私的態度與人合作。志同道合的團結可以克服重大困難（利涉大川）。但要注意：真正的團結基於公義而非私利。" },
  { num: 14, name: "大有", title: "火天大有", meaning: "日麗中天，萬物皆照", judgement: "元亨。", image: "火在天上，大有。君子以遏惡揚善。", vernacular: "太陽高掛天空，光明照耀一切——擁有豐盛的資源和大好局面。元始亨通，大吉大利。但擁有越多，責任越大，應當抑制邪惡、弘揚善良，不可因富有而驕縱。" },
  { num: 15, name: "謙", title: "地山謙", meaning: "謙尊而光，卑而不可踰", judgement: "亨，君子有終。", image: "地中有山，謙。君子以裒多益寡。", vernacular: "高山隱於地下，有實力卻不張揚。謙虛之人亨通順利，能得善終。謙是六十四卦中唯一六爻皆吉的卦。不論你現在處境如何，保持謙虛都是最安全的策略——滿招損，謙受益。" },
  { num: 16, name: "豫", title: "雷地豫", meaning: "順以動，豫順以動", judgement: "利建侯行師。", image: "雷出地奮，豫。先王以作樂崇德。", vernacular: "雷從地中奮起，萬物歡欣振奮——喜悅、順暢、準備充分的狀態。適合建立組織、發號施令、採取行動。但愉悅不可過度，樂極生悲，歡樂中仍需保持警覺和紀律。" },
  { num: 17, name: "隨", title: "澤雷隨", meaning: "隨時而動，擇善而隨", judgement: "元亨利貞，無咎。", image: "澤中有雷，隨。君子以嚮晦入宴息。", vernacular: "順應時勢而動，跟隨正確的方向。大吉大利，守正則無過失。天黑了就休息——順應自然節律，不要勉強。提醒你靈活應變，該領導時領導，該追隨時追隨，不固執己見。" },
  { num: 18, name: "蠱", title: "山風蠱", meaning: "振疲起衰，撥亂反正", judgement: "元亨，利涉大川。", image: "山下有風，蠱。君子以振民育德。", vernacular: "器皿久不用而生蟲蠹——積弊已久，需要整頓革新。看似壞事，其實是轉機：正因為有問題需要解決，反而帶來改革的機會。適合處理遺留問題、修復關係、重新出發。行動前先思考三天，行動後再觀察三天。" },
  { num: 19, name: "臨", title: "地澤臨", meaning: "居上臨下，親臨視察", judgement: "元亨利貞，至于八月有凶。", image: "澤上有地，臨。君子以教思無窮。", vernacular: "以居高臨下之勢，親近觀察下方事物。目前形勢大好，亨通吉利，但要注意盛況不會永遠持續——到了某個時間點（八月）情勢會轉變。把握當下好時機積極作為，同時為未來變化做準備。" },
  { num: 20, name: "觀", title: "風地觀", meaning: "觀天之道，省察自身", judgement: "盥而不薦，有孚顒若。", image: "風行地上，觀。先王以省方觀民設教。", vernacular: "風吹過大地，廣泛觀察一切。如同祭祀時洗手淨身的莊重時刻——以恭敬虔誠的態度觀察世界和自己。此時適合反思、學習、觀察局勢，而非急於行動。看清楚了再動。" },
  { num: 21, name: "噬嗑", title: "火雷噬嗑", meaning: "明罰敕法，剛柔相濟", judgement: "亨，利用獄。", image: "雷電噬嗑，先王以明罰敕法。", vernacular: "嘴巴裡有東西阻礙，必須咬碎它才能合攏——有障礙需要強力排除。適合處理法律事務、解決糾紛、清除阻礙。雷電交加，明察而果斷，該處罰就處罰，但要公正合理。" },
  { num: 22, name: "賁", title: "山火賁", meaning: "文飾光明，質樸為本", judgement: "亨，小利有攸往。", image: "山下有火，賁。君子以明庶政。", vernacular: "山下有火光映照，是裝飾美化之象。外在的修飾可以亨通，但只適合做小事。提醒你：形式和包裝有其價值，但不可本末倒置。適度修飾即可，內在實質才是根本。" },
  { num: 23, name: "剝", title: "山地剝", meaning: "陰盛陽衰，順時而止", judgement: "不利有攸往。", image: "山附於地，剝。上以厚下安宅。", vernacular: "山體逐漸崩落剝蝕——根基被侵蝕，形勢惡化。此時不利於採取任何行動。應該固守根基、厚待下屬、安頓好自己的根本。剝落到極點就會復回，靜待時機逆轉。" },
  { num: 24, name: "復", title: "地雷復", meaning: "一陽來復，生機再現", judgement: "亨。出入無疾，朋來無咎。", image: "雷在地中，復。先王以至日閉關。", vernacular: "一陽從地底重新升起——冬至之後白晝漸長，生機回歸。經過低谷之後開始恢復，是轉機的信號。不要急，讓恢復的力量自然生長。七天一個循環，遵循節律，出入平安。" },
  { num: 25, name: "无妄", title: "天雷无妄", meaning: "天命所歸，不可妄動", judgement: "元亨利貞。其匪正有眚。", image: "天下雷行，物與无妄。", vernacular: "天下打雷，萬物各得其所——一切按照天道自然運行，不要妄想妄動。真誠無妄則大吉，若心術不正或有非分之想，就會招來災禍。順其自然，做該做的事，不投機取巧。" },
  { num: 26, name: "大畜", title: "山天大畜", meaning: "蓄養賢才，積蓄力量", judgement: "利貞，不家食吉。利涉大川。", image: "天在山中，大畜。君子以多識前言往行。", vernacular: "天被山蓄止於其中——巨大的能量被積蓄起來。守正則吉利，不在家中吃飯（出外發展）是好的，可以渡過大的困難。適合大量學習、累積知識和資源，為將來的大作為做準備。" },
  { num: 27, name: "頤", title: "山雷頤", meaning: "頤養正道，自養養人", judgement: "貞吉。觀頤，自求口實。", image: "山下有雷，頤。君子以慎言語，節飲食。", vernacular: "頤是下巴、口腔——關乎養育和進食。守正則吉。觀察一個人如何養活自己和滋養他人，就能看出其品格。提醒你：慎選你攝取的東西（食物、資訊、關係），也謹慎你說出口的話。" },
  { num: 28, name: "大過", title: "澤風大過", meaning: "棟樑撓曲，非常之時", judgement: "棟橈，利有攸往，亨。", image: "澤滅木，大過。君子以獨立不懼。", vernacular: "房屋的棟樑彎曲了——承受的壓力超出正常負荷，是非常時期。但不必恐懼，大過之時反而利於果斷行動。獨立不懼、遁世無悶，即使孤獨也要堅持自己認為對的事。" },
  { num: 29, name: "坎", title: "坎為水", meaning: "重險在前，習坎而行", judgement: "習坎，有孚，維心亨。", image: "水洊至，習坎。君子以常德行，習教事。", vernacular: "水流一波接一波，重重險難接連不斷。但只要心中保持誠信，內心就能亨通。面對困難不是一次性的，而是反覆練習如何應對——如水流般，遇到坑窪就填滿它再繼續前進。" },
  { num: 30, name: "離", title: "離為火", meaning: "附麗光明，柔順中正", judgement: "利貞，亨。畜牝牛，吉。", image: "明兩作，離。大人以繼明照于四方。", vernacular: "火必須依附燃料才能燃燒——光明需要有所依附。守正則亨通，像畜養母牛般柔順而堅定。兩個太陽相繼升起，象徵持續不斷的光明。你需要找到值得依附的對象或事業，用柔順的方式發光。" },
  { num: 31, name: "咸", title: "澤山咸", meaning: "天地感應，萬物化生", judgement: "亨，利貞。取女吉。", image: "山上有澤，咸。君子以虛受人。", vernacular: "山上有澤水潤澤而下，山澤相互感應——這是感情交流、相互感動之卦。亨通，守正吉利，適合締結關係。虛懷若谷才能接納他人。提醒你：真誠的感應來自放空成見，用心去感受。" },
  { num: 32, name: "恆", title: "雷風恆", meaning: "恆久不已，守常不變", judgement: "亨，無咎，利貞。利有攸往。", image: "雷風恆，君子以立不易方。", vernacular: "雷與風相互助長，持續不斷——恆久之道。亨通無過失，守正吉利，利於有所行動。真正的恆心不是一成不變，而是在變化中保持核心不動搖。確立方向後就不要輕易改變。" },
  { num: 33, name: "遯", title: "天山遯", meaning: "小人漸長，退避保身", judgement: "亨，小利貞。", image: "天下有山，遯。君子以遠小人。", vernacular: "天下有山但天仍然高遠——主動退讓、遠離是非。並非怯懦，而是明智的策略性撤退。小事守正即可。知道何時該退場和知道何時該進場同樣重要，遠離不值得糾纏的人事物。" },
  { num: 34, name: "大壯", title: "雷天大壯", meaning: "剛以動，壯而不妄", judgement: "利貞。", image: "雷在天上，大壯。君子以非禮弗履。", vernacular: "雷在天上轟鳴，力量強大充沛。但越是強壯越要守正道——不合禮義的事絕對不做。提醒你：力量大的時候最容易犯錯，恃強凌弱只會招來禍患。以正道駕馭力量才是真正的強大。" },
  { num: 35, name: "晉", title: "火地晉", meaning: "明出地上，光明上進", judgement: "康侯用錫馬蕃庶，晝日三接。", image: "明出地上，晉。君子以自昭明德。", vernacular: "太陽從地平線升起——光明上進、前途光明。如同受封的諸侯得到賞賜，一天之內多次受到接見。晉升、進步、得到認可的好時機。讓自己的才德自然顯現出來，不需要刻意張揚。" },
  { num: 36, name: "明夷", title: "地火明夷", meaning: "明入地中，韜光養晦", judgement: "利艱貞。", image: "明入地中，明夷。君子以蒞眾，用晦而明。", vernacular: "太陽沉入地下，光明受損——才能被壓抑、處境艱難的時期。在困難中堅持正道才有利。表面收斂鋒芒，內心保持清明。不是放棄，而是保護自己的光，等待重新升起的時刻。" },
  { num: 37, name: "家人", title: "風火家人", meaning: "治家之道，正位居體", judgement: "利女貞。", image: "風自火出，家人。君子以言有物而行有恆。", vernacular: "火生風，風助火——家庭內部的和諧循環。各就其位、各盡其責，家道才能興旺。言語要有內容，行為要有恆心。治理任何組織（不只是家庭），都從內部的秩序和信任開始。" },
  { num: 38, name: "睽", title: "火澤睽", meaning: "二女同居，志不同行", judgement: "小事吉。", image: "上火下澤，睽。君子以同而異。", vernacular: "火往上燒、水往下流，方向相反——觀點分歧、立場不同。小事可以吉利，大事則困難。求同存異是智慧：承認差異的存在，在不同中尋找可以合作的部分，不必強求完全一致。" },
  { num: 39, name: "蹇", title: "水山蹇", meaning: "行路艱難，見險而止", judgement: "利西南，不利東北。利見大人，貞吉。", image: "山上有水，蹇。君子以反身修德。", vernacular: "前有險水、後有高山——進退兩難、寸步難行。往平坦開闊處（西南）有利，往險峻處（東北）不利。遇到困難時，先反省自己、修養德行，找到貴人相助。不是所有的困難都要硬闖。" },
  { num: 40, name: "解", title: "雷水解", meaning: "險難解散，百事舒緩", judgement: "利西南，無所往，其來復吉。", image: "雷雨作，解。君子以赦過宥罪。", vernacular: "雷雨大作，緊張的氣氛終於釋放——困難和危險開始消解。如果沒有特別要去的地方，回到原點是吉利的。趕快處理該解決的問題，不要拖延。寬恕別人的過錯，讓一切重新開始。" },
  { num: 41, name: "損", title: "山澤損", meaning: "損下益上，先難後獲", judgement: "有孚，元吉，無咎，可貞。", image: "山下有澤，損。君子以懲忿窒欲。", vernacular: "減損下方來增益上方——需要做出犧牲或付出代價。但只要真誠，就能大吉無過。減少憤怒、抑制慾望是最基本的自我修養。有時候放棄一些東西反而能得到更重要的東西，關鍵是真心誠意。" },
  { num: 42, name: "益", title: "風雷益", meaning: "損上益下，風雷相助", judgement: "利有攸往，利涉大川。", image: "風雷益，君子以見善則遷，有過則改。", vernacular: "風雷相互增益——上方減損自己來增益下方，是增益之象。利於行動，利於克服重大困難。見到好的就學習，發現錯誤就改正。把握增益的好時機積極作為，不要坐失良機。" },
  { num: 43, name: "夬", title: "澤天夬", meaning: "決而能和，剛決柔也", judgement: "揚于王庭，孚號有厲。", image: "澤上於天，夬。君子以施祿及下。", vernacular: "洪水漫過天際——決堤、決斷、果決之象。在公開場合宣布決定，但要注意危險。以正義之名剷除邪惡，但不可使用暴力手段。剛強果決的同時也要施恩惠於人，不可趕盡殺絕。" },
  { num: 44, name: "姤", title: "天風姤", meaning: "一陰遇五陽，不期而遇", judgement: "女壯，勿用取女。", image: "天下有風，姤。后以施命誥四方。", vernacular: "天下起了風——不期而遇、偶然相逢之象。一個陰爻從下方進入，看似柔弱卻很強勢。提醒你留意突然出現的人事物，看起來無害但可能影響深遠。不要輕率地被表象吸引。" },
  { num: 45, name: "萃", title: "澤地萃", meaning: "聚合精英，萃聚天下", judgement: "亨。王假有廟，利見大人，亨，利貞。", image: "澤上於地，萃。君子以除戎器，戒不虞。", vernacular: "水聚於地上形成湖澤——人才聚集、眾人匯聚之象。亨通順利，適合參加重要聚會、拜見貴人。但聚集之處也容易產生衝突，要預先準備、防範意外。凝聚人心需要共同的信仰和目標。" },
  { num: 46, name: "升", title: "地風升", meaning: "積小成大，順勢上升", judgement: "元亨，用見大人，勿恤。南征吉。", image: "地中生木，升。君子以順德，積小以高大。", vernacular: "樹木從地底生長，一點一點向上——穩定上升之象。大吉大利，適合拜見重要人物，不必擔憂。向南方發展吉利。成長不是跳躍式的，而是像樹木一樣，順應天性，積少成多，日漸茁壯。" },
  { num: 47, name: "困", title: "澤水困", meaning: "澤無水，窮困艱難", judgement: "亨，貞大人吉，無咎。有言不信。", image: "澤無水，困。君子以致命遂志。", vernacular: "湖澤裡沒有水——資源枯竭、陷入困境。但困境中仍能亨通，有德之人能化困為吉。此時說話別人不會相信，所以少說多做。即使面臨生命考驗也要堅持自己的志向，不可因困頓而放棄。" },
  { num: 48, name: "井", title: "水風井", meaning: "井養不窮，汲取智慧", judgement: "改邑不改井，無喪無得。", image: "木上有水，井。君子以勞民勸相。", vernacular: "村落可以搬遷，但井不會移動——不變的根本、持續供給的源泉。井水不會減少也不會增多，穩定地滋養眾人。提醒你找到並維護那些恆定不變的價值和資源，不要汲汲於表面的得失。" },
  { num: 49, name: "革", title: "澤火革", meaning: "天地革而四時成", judgement: "已日乃孚，元亨利貞，悔亡。", image: "澤中有火，革。君子以治歷明時。", vernacular: "澤中有火，水火相激——革命、變革之象。變革需要時機成熟後才能取信於人。完成變革的那一天，大吉大利，後悔消失。天地通過四季更替來革新，該改變的時候就要果斷改變。" },
  { num: 50, name: "鼎", title: "火風鼎", meaning: "革故鼎新，養賢以德", judgement: "元吉，亨。", image: "木上有火，鼎。君子以正位凝命。", vernacular: "木頭上燃燒著火，鼎中烹煮食物——鼎是烹飪器具，也是國之重器。大吉亨通。經過變革（革卦）之後建立新秩序。端正自己的位置，凝聚天命。適合開創新局、建立制度、養育人才。" },
  { num: 51, name: "震", title: "震為雷", meaning: "洊雷震動，恐致福也", judgement: "亨。震來虩虩，笑言啞啞。", image: "洊雷震，君子以恐懼修省。", vernacular: "雷聲一陣接一陣——巨大的震動和驚嚇。雷來時恐懼顫慄，雷過後談笑自若。震驚不是壞事，它讓你警醒反省。經歷過震動考驗的人，反而能從容面對未來。恐懼是修養的開始。" },
  { num: 52, name: "艮", title: "艮為山", meaning: "時止則止，時行則行", judgement: "艮其背，不獲其身。", image: "兼山艮，君子以思不出其位。", vernacular: "兩座山重疊——停止、靜止之象。像是只看到背部看不到整個人——不要過度在意自我。該停下來的時候就停下來，在自己的位置上安分守己。思慮不超出自己的本分，靜定才能生智慧。" },
  { num: 53, name: "漸", title: "風山漸", meaning: "循序漸進，以正合禮", judgement: "女歸吉，利貞。", image: "山上有木，漸。君子以居賢德善俗。", vernacular: "樹木在山上慢慢生長——循序漸進、按部就班。如女子出嫁般按照禮儀一步步來，吉利。不要跳過必要的步驟，急於求成反而壞事。以美好的品德漸漸影響周圍的風俗，才是長久之道。" },
  { num: 54, name: "歸妹", title: "雷澤歸妹", meaning: "以悅而動，天地之大義", judgement: "征凶，無攸利。", image: "澤上有雷，歸妹。君子以永終知敝。", vernacular: "少女因歡悅而衝動行事——不顧禮節、急於求成。前進則凶，沒有什麼有利的。提醒你不要因為一時高興就做出重大決定。要看到事物的最終結局，了解其中可能的弊端再行動。" },
  { num: 55, name: "豐", title: "雷火豐", meaning: "日中則昃，盈不可久", judgement: "亨，王假之，勿憂，宜日中。", image: "雷電皆至，豐。君子以折獄致刑。", vernacular: "雷電同時降臨——盛大、豐盛到極點。亨通，不必憂慮，像正午的太陽般光明。但日正當中之後就會西斜，豐盛不可能永遠維持。趁著豐盛的時候明斷是非，做該做的事。" },
  { num: 56, name: "旅", title: "火山旅", meaning: "親寡旅瑣，行旅在外", judgement: "小亨，旅貞吉。", image: "山上有火，旅。君子以明慎用刑。", vernacular: "山上有火，火勢不定——旅人在外，居無定所。小事亨通，旅行中守正則吉。在外漂泊時處事要小心謹慎，不可傲慢。親人稀少、瑣事繁多是旅途常態，保持低調和靈活。" },
  { num: 57, name: "巽", title: "巽為風", meaning: "隨風而入，順而巽也", judgement: "小亨，利有攸往，利見大人。", image: "隨風巽，君子以申命行事。", vernacular: "風接連不斷地吹拂——柔順、滲透、無孔不入。小事亨通，利於有所行動，利於拜見重要人物。風的力量不在猛烈，而在持續和滲透。用溫和但堅定的方式推進你的意圖，反覆申明你的方向。" },
  { num: 58, name: "兌", title: "兌為澤", meaning: "麗澤相潤，朋友講習", judgement: "亨，利貞。", image: "麗澤兌，君子以朋友講習。", vernacular: "兩個湖澤相連互相滋潤——喜悅、交流、互相學習。亨通，守正吉利。真正的喜悅來自與朋友切磋交流、教學相長。外在的歡樂要建立在內心的正直之上，否則就變成了放縱。" },
  { num: 59, name: "渙", title: "風水渙", meaning: "風行水上，渙散離散", judgement: "亨。王假有廟，利涉大川，利貞。", image: "風行水上，渙。先王以享于帝立廟。", vernacular: "風吹過水面，水波四散——渙散、分散之象。但渙散也能亨通：打破固有的僵局、解散停滯的狀態。用共同的信仰（如同建立宗廟）來重新凝聚人心。有時候需要先散開再重新聚合。" },
  { num: 60, name: "節", title: "水澤節", meaning: "澤有水限，節制有度", judgement: "亨。苦節不可貞。", image: "澤上有水，節。君子以制數度，議德行。", vernacular: "湖澤上方有水但有岸限制——節制、節度之象。適度的節制是亨通的，但過度苦行式的節制反而不可取。建立合理的制度和標準，不要走極端。真正的自律是讓生活有序，而非自我折磨。" },
  { num: 61, name: "中孚", title: "風澤中孚", meaning: "誠信感物，中心誠信", judgement: "豚魚吉，利涉大川，利貞。", image: "澤上有風，中孚。君子以議獄緩死。", vernacular: "風吹過湖面，水面產生共鳴——發自內心的誠信。連對豬和魚這樣微小的生物都能以誠相待，就能吉利。誠信的力量可以克服重大困難。審慎思考後再做重大決定，給人改過的機會。" },
  { num: 62, name: "小過", title: "雷山小過", meaning: "小事可為，不可大事", judgement: "亨，利貞。可小事，不可大事。", image: "山上有雷，小過。君子以行過乎恭。", vernacular: "雷在山上，聲音向下——小幅度的超越和過度。可以做小事，不適合做大事。行為上寧可過於恭敬、過於節儉、過於哀傷，也不要過於放縱。小心翼翼地處理日常事務，不要好高騖遠。" },
  { num: 63, name: "既濟", title: "水火既濟", meaning: "萬事已成，守成防衰", judgement: "亨小，利貞。初吉終亂。", image: "水在火上，既濟。君子以思患而預防之。", vernacular: "水在火上，完美配合——事情已經完成、渡過難關。但小心！開頭吉利，結尾可能混亂。越是一切就緒的時候越要居安思危、防患未然。完美的狀態最難維持，稍有鬆懈就可能前功盡棄。" },
  { num: 64, name: "未濟", title: "火水未濟", meaning: "事未成終，尚待努力", judgement: "亨。小狐汔濟，濡其尾，無攸利。", image: "火在水上，未濟。君子以慎辨物居方。", vernacular: "火在水上方，互不相交——事情尚未完成，仍在進行中。小狐狸快要渡過河了卻弄濕了尾巴——功虧一簣。但未濟也是希望：一切都還有可能，只要審慎辨別、各就各位，終將迎來完成。易經以未濟作結，意味著變化永無止境。" },
];

function getLines(num) {
  const kingWenMap = {
    1:[1,1,1,1,1,1],2:[0,0,0,0,0,0],3:[1,0,0,0,1,0],4:[0,1,0,0,0,1],
    5:[1,1,1,0,1,0],6:[0,1,0,1,1,1],7:[0,1,0,0,0,0],8:[0,0,0,0,1,0],
    9:[1,1,1,0,1,1],10:[1,1,0,1,1,1],11:[1,1,1,0,0,0],12:[0,0,0,1,1,1],
    13:[1,0,1,1,1,1],14:[1,1,1,1,0,1],15:[0,0,1,0,0,0],16:[0,0,0,1,0,0],
    17:[1,0,0,1,1,0],18:[0,1,1,0,0,1],19:[1,1,0,0,0,0],20:[0,0,0,0,1,1],
    21:[1,0,0,1,0,1],22:[1,0,1,0,0,1],23:[0,0,0,0,0,1],24:[1,0,0,0,0,0],
    25:[1,0,0,1,1,1],26:[1,1,1,0,0,1],27:[1,0,0,0,0,1],28:[0,1,1,1,1,0],
    29:[0,1,0,0,1,0],30:[1,0,1,1,0,1],31:[0,0,1,1,1,0],32:[0,1,1,1,0,0],
    33:[0,0,1,1,1,1],34:[1,1,1,1,0,0],35:[0,0,0,1,0,1],36:[1,0,1,0,0,0],
    37:[1,0,1,0,1,1],38:[1,1,0,1,0,1],39:[0,0,1,0,1,0],40:[0,1,0,1,0,0],
    41:[1,1,0,0,0,1],42:[1,0,0,0,1,1],43:[1,1,1,1,1,0],44:[0,1,1,1,1,1],
    45:[0,0,0,1,1,0],46:[0,1,1,0,0,0],47:[0,1,0,1,1,0],48:[0,1,1,0,1,0],
    49:[1,0,1,1,1,0],50:[0,1,1,1,0,1],51:[1,0,0,1,0,0],52:[0,0,1,0,0,1],
    53:[0,0,1,0,1,1],54:[1,1,0,1,0,0],55:[1,0,0,1,0,1],56:[1,0,1,0,0,1],
    57:[0,1,1,0,1,1],58:[1,1,0,1,1,0],59:[0,1,0,0,1,1],60:[1,1,0,0,1,0],
    61:[1,1,0,0,1,1],62:[0,0,1,1,0,0],63:[1,0,1,0,1,0],64:[0,1,0,1,0,1],
  };
  return kingWenMap[num] || [0,0,0,0,0,0];
}

function castLine() {
  const r = Math.random();
  if (r < 0.0625) return 6;
  if (r < 0.3125) return 7;
  if (r < 0.5625) return 8;
  return 9;
}

function HexagramDisplay({ lines, animatedCount, size = "large" }) {
  const s = size === "large" ? { w: 120, h: 14, gap: 10 } : { w: 60, h: 7, gap: 5 };
  const totalH = 6 * s.h + 5 * s.gap;
  return (
    <svg width={s.w} height={totalH} viewBox={`0 0 ${s.w} ${totalH}`}>
      {lines.map((line, i) => {
        const displayIndex = 5 - i;
        const y = displayIndex * (s.h + s.gap);
        const show = i < animatedCount;
        const isYang = line === 7 || line === 9;
        const isChanging = line === 6 || line === 9;
        return (
          <g key={i} style={{ opacity: show ? 1 : 0, transition: "opacity 0.6s ease", transitionDelay: `${i * 0.15}s` }}>
            {isYang ? (
              <rect x={0} y={y} width={s.w} height={s.h} fill="currentColor" rx={2} />
            ) : (
              <><rect x={0} y={y} width={s.w * 0.42} height={s.h} fill="currentColor" rx={2} /><rect x={s.w * 0.58} y={y} width={s.w * 0.42} height={s.h} fill="currentColor" rx={2} /></>
            )}
            {isChanging && size === "large" && (
              <circle cx={s.w + 16} cy={y + s.h/2} r={4} fill="none" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.6 }} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Particles({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(Array.from({ length: 24 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, duration: Math.random() * 3 + 2, delay: Math.random() * 2,
    })));
  }, [active]);
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(193, 154, 107, 0.4)",
          animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
      <style>{`@keyframes float { from { transform: translateY(0) scale(1); opacity: 0.3; } to { transform: translateY(-30px) scale(1.5); opacity: 0; } }`}</style>
    </div>
  );
}

export default function IChing() {
  const [phase, setPhase] = useState("idle");
  const [castLines, setCastLines] = useState([]);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [hexagram, setHexagram] = useState(null);
  const [changingTo, setChangingTo] = useState(null);
  const [question, setQuestion] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showVernacular, setShowVernacular] = useState(false);

  const getHexagramFromLines = useCallback((lines) => {
    const binaryLines = lines.map(l => (l === 7 || l === 9) ? 1 : 0);
    for (const h of HEXAGRAMS) {
      const expected = getLines(h.num);
      if (expected.every((v, i) => v === binaryLines[i])) return h;
    }
    return HEXAGRAMS[0];
  }, []);

  const startCast = useCallback(() => {
    setPhase("casting"); setAnimatedCount(0); setHexagram(null); setChangingTo(null); setShowImage(false); setShowVernacular(false);
    const newLines = Array.from({ length: 6 }, () => castLine());
    setCastLines(newLines);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setAnimatedCount(count);
      if (count >= 6) {
        clearInterval(interval);
        setTimeout(() => {
          const h = getHexagramFromLines(newLines);
          setHexagram(h);
          const hasChanging = newLines.some(l => l === 6 || l === 9);
          if (hasChanging) {
            const changedLines = newLines.map(l => { if (l === 9) return 8; if (l === 6) return 7; return l; });
            setChangingTo(getHexagramFromLines(changedLines));
          }
          setPhase("reveal");
        }, 600);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [getHexagramFromLines]);

  const reset = useCallback(() => {
    setPhase("idle"); setCastLines([]); setAnimatedCount(0); setHexagram(null); setChangingTo(null); setQuestion(""); setShowImage(false); setShowVernacular(false);
  }, []);

  const tBtn = (active) => ({
    padding: "8px 24px", background: active ? "rgba(193,154,107,0.08)" : "transparent",
    border: `1px solid rgba(193,154,107,${active ? 0.4 : 0.2})`, color: "#c19a6b",
    fontSize: 12, fontFamily: "inherit", cursor: "pointer", letterSpacing: 3,
    opacity: active ? 0.9 : 0.6, transition: "all 0.3s ease",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1a1714", color: "#c19a6b", fontFamily: "'Noto Serif TC', 'Source Han Serif TC', 'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(193,154,107,0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(139,90,43,0.05) 0%, transparent 50%)" }} />
      <div style={{ position: "fixed", inset: 12, pointerEvents: "none", border: "1px solid rgba(193,154,107,0.15)", borderRadius: 2 }}>
        <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(193,154,107,0.08)" }} />
        {[{ top: -3, left: -3 }, { top: -3, right: -3 }, { bottom: -3, left: -3 }, { bottom: -3, right: -3 }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, width: 6, height: 6, background: "#c19a6b", opacity: 0.3 }} />
        ))}
      </div>
      <Particles active={phase === "casting"} />

      <header style={{ marginTop: 48, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: 8, textTransform: "uppercase", opacity: 0.5, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Ex Libris Divinatio</div>
        <h1 style={{ fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: 12 }}>易</h1>
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #c19a6b, transparent)", margin: "12px auto" }} />
        <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: 3 }}>周 易 卜 筮</div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        {phase === "idle" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, animation: "fadeIn 0.8s ease" }}>
            <div style={{ fontSize: 13, opacity: 0.6, textAlign: "center", lineHeight: 2, maxWidth: 280 }}>靜心凝神<br/>心中默念所問之事<br/>而後擲卦</div>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="所問之事（可不填）"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(193,154,107,0.06)", border: "1px solid rgba(193,154,107,0.2)", borderRadius: 2, color: "#c19a6b", fontSize: 14, fontFamily: "inherit", outline: "none", textAlign: "center", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "rgba(193,154,107,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(193,154,107,0.2)"} />
            </div>
            <button onClick={startCast} style={{ padding: "14px 48px", background: "transparent", border: "1px solid rgba(193,154,107,0.4)", color: "#c19a6b", fontSize: 15, fontFamily: "inherit", cursor: "pointer", letterSpacing: 6, transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.target.style.background = "rgba(193,154,107,0.1)"; e.target.style.borderColor = "rgba(193,154,107,0.6)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(193,154,107,0.4)"; }}>擲 卦</button>
          </div>
        )}

        {phase === "casting" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ fontSize: 13, opacity: 0.5, letterSpacing: 4, animation: "pulse 2s ease-in-out infinite" }}>蓍 草 演 算 中 ⋯</div>
            <HexagramDisplay lines={castLines} animatedCount={animatedCount} />
          </div>
        )}

        {phase === "reveal" && hexagram && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, animation: "fadeIn 0.8s ease", width: "100%" }}>
            {question && <div style={{ fontSize: 12, opacity: 0.4, textAlign: "center", marginBottom: 4 }}>「{question}」</div>}

            <div style={{ display: "flex", alignItems: "center", gap: changingTo ? 32 : 0, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <HexagramDisplay lines={castLines} animatedCount={6} />
                <div style={{ marginTop: 12, fontSize: 11, opacity: 0.4 }}>本卦</div>
              </div>
              {changingTo && (<>
                <div style={{ fontSize: 20, opacity: 0.3, marginTop: -20 }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <HexagramDisplay lines={castLines.map(l => { if (l === 9) return 8; if (l === 6) return 7; return l; })} animatedCount={6} />
                  <div style={{ marginTop: 12, fontSize: 11, opacity: 0.4 }}>之卦</div>
                </div>
              </>)}
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 400, letterSpacing: 4 }}>{hexagram.name}</div>
              <div style={{ fontSize: 16, opacity: 0.6, marginTop: 4, letterSpacing: 2 }}>{hexagram.title}</div>
              {changingTo && <div style={{ fontSize: 13, opacity: 0.4, marginTop: 8 }}>之 {changingTo.title}</div>}
            </div>

            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, #c19a6b, transparent)" }} />

            <div style={{ textAlign: "center", lineHeight: 2, maxWidth: 320 }}>
              <div style={{ fontSize: 14, marginBottom: 16 }}>{hexagram.meaning}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                <div style={{ opacity: 0.4, fontSize: 11, marginBottom: 6, letterSpacing: 2 }}>卦 辭</div>
                {hexagram.judgement}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setShowVernacular(!showVernacular)} style={tBtn(showVernacular)}
                onMouseEnter={e => e.target.style.opacity = "1"} onMouseLeave={e => e.target.style.opacity = showVernacular ? "0.9" : "0.6"}>
                {showVernacular ? "收起" : "白 話 解"}
              </button>
              <button onClick={() => setShowImage(!showImage)} style={tBtn(showImage)}
                onMouseEnter={e => e.target.style.opacity = "1"} onMouseLeave={e => e.target.style.opacity = showImage ? "0.9" : "0.6"}>
                {showImage ? "收起" : "象 辭"}
              </button>
            </div>

            {showVernacular && (
              <div style={{ padding: "16px 20px", background: "rgba(193,154,107,0.04)", border: "1px solid rgba(193,154,107,0.12)", borderRadius: 2, maxWidth: 340, animation: "fadeIn 0.5s ease" }}>
                <div style={{ opacity: 0.4, fontSize: 11, marginBottom: 10, letterSpacing: 2, textAlign: "center" }}>白 話 原 義</div>
                <div style={{ fontSize: 13, lineHeight: 2, opacity: 0.75, textAlign: "justify" }}>{hexagram.vernacular}</div>
              </div>
            )}
            {showVernacular && changingTo && (
              <div style={{ padding: "14px 18px", background: "rgba(193,154,107,0.02)", border: "1px solid rgba(193,154,107,0.08)", borderRadius: 2, maxWidth: 340, animation: "fadeIn 0.5s ease" }}>
                <div style={{ opacity: 0.4, fontSize: 11, marginBottom: 8, letterSpacing: 2, textAlign: "center" }}>之卦・{changingTo.title}　白話</div>
                <div style={{ fontSize: 12, lineHeight: 2, opacity: 0.6, textAlign: "justify" }}>{changingTo.vernacular}</div>
              </div>
            )}

            {showImage && (
              <div style={{ fontSize: 12, opacity: 0.5, textAlign: "center", lineHeight: 2, maxWidth: 300, animation: "fadeIn 0.5s ease" }}>{hexagram.image}</div>
            )}
            {changingTo && showImage && (
              <div style={{ padding: "12px 20px", background: "rgba(193,154,107,0.04)", border: "1px solid rgba(193,154,107,0.1)", borderRadius: 2, textAlign: "center", fontSize: 12, opacity: 0.5, lineHeight: 2, maxWidth: 300 }}>
                <div style={{ opacity: 0.6, fontSize: 11, marginBottom: 4, letterSpacing: 2 }}>之卦・{changingTo.title}</div>
                {changingTo.meaning}
                <div style={{ marginTop: 8, fontSize: 11 }}>{changingTo.image}</div>
              </div>
            )}

            <div style={{ fontSize: 11, opacity: 0.35, textAlign: "center", marginTop: 4, lineHeight: 1.8 }}>
              {castLines.map((l, i) => {
                const names = ["初", "二", "三", "四", "五", "上"];
                const yinYang = (l === 7 || l === 9) ? "陽" : "陰";
                const changing = (l === 6 || l === 9) ? " ◯" : "";
                return `${names[i]}${yinYang}${changing}`;
              }).join("　")}
            </div>

            <button onClick={reset} style={{ marginTop: 16, padding: "10px 36px", background: "transparent", border: "1px solid rgba(193,154,107,0.3)", color: "#c19a6b", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: 4, transition: "all 0.3s ease" }}
              onMouseEnter={e => e.target.style.background = "rgba(193,154,107,0.08)"}
              onMouseLeave={e => e.target.style.background = "transparent"}>再 卜</button>
          </div>
        )}
      </main>

      <footer style={{ paddingBottom: 32, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", padding: "6px 12px", border: "1.5px solid rgba(193,154,107,0.25)", fontSize: 11, letterSpacing: 4, opacity: 0.35, transform: "rotate(-1deg)" }}>藏書票占</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(193,154,107,0.3); }
        input:focus { box-shadow: 0 0 0 1px rgba(193,154,107,0.1); }
        @media (max-width: 480px) { h1 { font-size: 28px !important; } }
      `}</style>
    </div>
  );
}
