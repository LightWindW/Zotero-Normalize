export function SwitchFLName() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];

  // 常见中文姓氏列表（扩展范围）
  const chineseSurnames = [
    // 常见单字姓
    "李",
    "王",
    "张",
    "刘",
    "陈",
    "杨",
    "赵",
    "黄",
    "周",
    "吴",
    "徐",
    "孙",
    "胡",
    "朱",
    "高",
    "林",
    "何",
    "郭",
    "马",
    "罗",
    "梁",
    "宋",
    "郑",
    "谢",
    "韩",
    "唐",
    "冯",
    "于",
    "董",
    "萧",
    "程",
    "曹",
    "袁",
    "邓",
    "许",
    "傅",
    "沈",
    "曾",
    "彭",
    "吕",
    "苏",
    "卢",
    "蒋",
    "蔡",
    "贾",
    "丁",
    "魏",
    "薛",
    "叶",
    "阎",
    "余",
    "潘",
    "杜",
    "戴",
    "夏",
    "钟",
    "汪",
    "田",
    "任",
    "姜",
    "范",
    "方",
    "石",
    "姚",
    "谭",
    "廖",
    "邹",
    "熊",
    "金",
    "陆",
    "郝",
    "孔",
    "白",
    "崔",
    "康",
    "毛",
    "邱",
    "秦",
    "江",
    "史",
    "顾",
    "侯",
    "邵",
    "孟",
    "龙",
    "万",
    "段",
    "章",
    "钱",
    "汤",
    "尹",
    "黎",
    "易",
    "常",
    "武",
    "乔",
    "贺",
    "赖",
    "龚",
    "文",
    "庞",
    "樊",
    "兰",
    "殷",
    "施",
    "陶",
    "洪",
    "翟",
    "安",
    "颜",
    "倪",
    "严",
    "牛",
    "温",
    "芦",
    "季",
    "俞",
    "章",
    "鲁",
    "葛",
    "伍",
    "韦",
    "申",
    "尤",
    "毕",
    "聂",
    "丛",
    "焦",
    "向",
    "柳",
    "邢",
    "路",
    "岳",
    "齐",
    "沿",
    "梅",
    "莫",
    "庄",
    "辛",
    "管",
    "祝",
    "左",
    "涂",
    "谷",
    "冷",

    // 常见复姓
    "欧阳",
    "太史",
    "端木",
    "上官",
    "司马",
    "东方",
    "独孤",
    "南宫",
    "万俟",
    "闻人",
    "夏侯",
    "诸葛",
    "尉迟",
    "公羊",
    "赫连",
    "澹台",
    "皇甫",
    "宗政",
    "濮阳",
    "公冶",
    "太叔",
    "申屠",
    "公孙",
    "慕容",
    "仲孙",
    "钟离",
    "长孙",
    "宇文",
    "司徒",
    "鲜于",
    "司空",
    "闾丘",
    "子车",
    "亓官",
    "司寇",
    "巫马",
    "公西",
    "颛孙",
    "壤驷",
    "公良",
    "漆雕",
    "乐正",
    "宰父",
    "谷梁",
    "拓跋",
    "夹谷",
    "轩辕",
    "令狐",
    "段干",
    "百里",
    "呼延",
    "东郭",
    "南门",
    "羊舌",
    "微生",
    "公户",
    "公玉",
    "公仪",
    "梁丘",
    "公仲",
    "公上",
    "公门",
    "公山",
    "公坚",
    "左丘",
    "公伯",
    "西门",
    "公祖",
    "第五",
    "公乘",
    "贯丘",
    "公皙",
    "南荣",
    "东里",
    "海西",
    "淳于",
    "单于",
    "田丘",
    "公羽",
    "锺离",
  ];

  /**
   * 检测字符串是否包含中文
   */
  function isChinese(str: string): boolean {
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(str);
  }

  /**
   * 查找中文姓氏在姓名中的位置（改进版）
   */
  function findChineseSurnamePosition(name: string): {
    surname: string;
    position: "first" | "last" | "none";
    givenName: string;
  } {
    const cleanName = name.replace(/\s+/g, ""); // 去除空格

    // 先检查复姓（从长到短）
    const sortedSurnames = chineseSurnames.sort((a, b) => b.length - a.length);

    // 检查姓在开头的情况
    for (const surname of sortedSurnames) {
      if (cleanName.startsWith(surname)) {
        const givenName = cleanName.substring(surname.length);
        return { surname, position: "first", givenName };
      }
    }

    // 检查姓在结尾的情况
    for (const surname of sortedSurnames) {
      if (cleanName.endsWith(surname)) {
        const givenName = cleanName.substring(
          0,
          cleanName.length - surname.length,
        );
        return { surname, position: "last", givenName };
      }
    }

    return { surname: "", position: "none", givenName: "" };
  }

  /**
   * 改进的中文姓名交换逻辑
   */
  function switchChineseName(fullName: string): string {
    const cleanName = fullName.replace(/\s+/g, "");

    // 尝试找到姓氏
    const result = findChineseSurnamePosition(cleanName);

    if (result.position !== "none") {
      // 找到了姓氏，进行交换
      if (result.position === "first") {
        // 原格式：姓+名 → 交换后：名+姓
        return result.givenName + result.surname;
      } else {
        // 原格式：名+姓 → 交换后：姓+名
        return result.surname + result.givenName;
      }
    } else {
      // 没有找到常见姓氏，尝试智能处理
      if (cleanName.length === 2) {
        // 两个字的情况，直接交换
        return cleanName.charAt(1) + cleanName.charAt(0);
      } else if (cleanName.length === 3) {
        // 三个字的情况，可能是：
        // 1. 单姓+双名：张三四 ↔ 三四张
        // 2. 双姓+单名：欧阳修 ↔ 修欧阳

        // 检查第一个字是否为姓
        const firstChar = cleanName.charAt(0);
        const lastChar = cleanName.charAt(2);

        if (chineseSurnames.includes(firstChar)) {
          // 第一个字是姓：张三四 → 三四张
          return cleanName.substring(1) + firstChar;
        } else if (chineseSurnames.includes(lastChar)) {
          // 最后一个字是姓：三四张 → 张三四
          return lastChar + cleanName.substring(0, 2);
        } else {
          // 都不是常见姓，按中间分割
          return cleanName.substring(1) + cleanName.charAt(0);
        }
      } else if (cleanName.length >= 4) {
        // 四个字及以上，检查前两个字是否为复姓
        const firstTwoChars = cleanName.substring(0, 2);
        const lastTwoChars = cleanName.substring(cleanName.length - 2);

        if (chineseSurnames.includes(firstTwoChars)) {
          // 前两个字是复姓：欧阳志远 → 志远欧阳
          return cleanName.substring(2) + firstTwoChars;
        } else if (chineseSurnames.includes(lastTwoChars)) {
          // 后两个字是复姓：志远欧阳 → 欧阳志远
          return lastTwoChars + cleanName.substring(0, cleanName.length - 2);
        } else {
          // 按第一个字分割
          return cleanName.substring(1) + cleanName.charAt(0);
        }
      }

      // 其他情况保持原样
      return cleanName;
    }
  }

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: Zotero.Creator[] = [];

    for (const creator of creators) {
      if (creator.fieldMode === 1) {
        // 单栏模式：判断中文还是英文
        if (creator.lastName && creator.lastName.trim()) {
          const fullName = creator.lastName.trim();

          if (isChinese(fullName)) {
            // 中文姓名处理（使用改进的逻辑）
            const switchedName = switchChineseName(fullName);

            newCreators.push({
              creatorTypeID: creator.creatorTypeID,
              lastName: switchedName,
              fieldMode: 1,
            });
          } else {
            // 英文姓名处理（保持原逻辑）
            const firstSpaceIndex = fullName.indexOf(" ");
            let firstName = "";
            let lastName = "";

            if (firstSpaceIndex > 0) {
              const firstPart = fullName.substring(0, firstSpaceIndex);
              const secondPart = fullName.substring(firstSpaceIndex + 1);
              firstName = firstPart;
              lastName = secondPart;
            } else {
              lastName = fullName;
            }

            const switchedName = lastName + (firstName ? " " + firstName : "");

            newCreators.push({
              creatorTypeID: creator.creatorTypeID,
              lastName: switchedName,
              fieldMode: 1,
            });
          }
        } else {
          newCreators.push(creator);
        }
      } else {
        // 双栏模式：直接交换firstName和lastName
        const temp = creator.firstName;
        newCreators.push({
          creatorTypeID: creator.creatorTypeID,
          firstName: creator.lastName,
          lastName: temp,
          fieldMode: 0,
        });
      }
    }

    item.setCreators(newCreators);
    item.saveTx();
  }
}
