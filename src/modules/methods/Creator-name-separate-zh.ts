export function separateNameZh() {
  // 获取当前选中的条目
  const items = Zotero.getActiveZoteroPane().getSelectedItems();

  // 常见的中文复姓列表
  const compoundSurnames = [
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

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: Zotero.Creator[] = [];

    for (const creator of creators) {
      // 仅处理 single field 作者（fieldMode = 1）
      if (creator.fieldMode === 1 && creator.lastName) {
        // 删除所有空格
        const fullName = creator.lastName.trim().replace(/\s+/g, "");

        let firstName = "";
        let lastName = "";

        // 如果姓名长度小于2，直接作为姓存储
        if (fullName.length < 2) {
          lastName = fullName;
          firstName = "";
        } else {
          // 检查是否包含复姓
          let isCompoundSurname = false;

          // 检查前两个字是否为复姓
          if (fullName.length >= 2) {
            const firstTwoChars = fullName.substring(0, 2);
            if (compoundSurnames.includes(firstTwoChars)) {
              lastName = firstTwoChars;
              firstName = fullName.substring(2);
              isCompoundSurname = true;
            }
          }

          // 如果不是复姓，第一个字为姓
          if (!isCompoundSurname) {
            lastName = fullName.substring(0, 1);
            firstName = fullName.substring(1);
          }
        }

        newCreators.push({
          creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
          firstName,
          lastName,
          fieldMode: 0, // 使用 two-field 模式
        });
      } else {
        // 已经是 two-field 或其他情况，保留原样
        newCreators.push(creator);
      }
    }

    item.setCreators(newCreators);
    item.saveTx();
  }
}
