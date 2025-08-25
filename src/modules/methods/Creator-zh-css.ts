/**
 * 中文作者姓名显示优化插件
 * 功能：在展示层将中文作者姓名调整为符合中文阅读习惯的格式
 * 原理：不修改原始数据，仅在页面渲染层面进行调整
 */

interface ChineseNameProcessor {
  originalText: string;
  processedText: string;
  fieldMode: number;
}

class ChineseNameDisplayManager {
  private static instance: ChineseNameDisplayManager;
  private observer: MutationObserver | null = null;
  private processedElements = new WeakSet<Element>();

  private constructor() {}

  public static getInstance(): ChineseNameDisplayManager {
    if (!ChineseNameDisplayManager.instance) {
      ChineseNameDisplayManager.instance = new ChineseNameDisplayManager();
    }
    return ChineseNameDisplayManager.instance;
  }

  /**
   * 判断条目是否为中文条目
   */
  private isChineseItem(item: Zotero.Item): boolean {
    try {
      const language = item.getField("language") as string;
      return (
        language === "zh" ||
        language === "zh-CN" ||
        language === "zh_CN" ||
        language === "Chinese"
      );
    } catch (error) {
      ztoolkit.log("检查条目语言时出错:", error);
      return false;
    }
  }

  /**
   * 处理中文姓名顺序
   * @param originalName 原始姓名（如"三齐 张"或"张 三齐"）
   * @param fieldMode 字段模式（0=双栏，1=单栏）
   * @returns 处理后的姓名（如"张三齐"）
   */
  private processChineseName(
    originalName: string,
    fieldMode: number,
  ): ChineseNameProcessor {
    if (!originalName || originalName.trim() === "") {
      return {
        originalText: originalName,
        processedText: originalName,
        fieldMode: fieldMode,
      };
    }

    let processedName = originalName.trim();

    if (fieldMode === 1) {
      // 单栏模式：假设格式为"名 姓"或"姓名"
      const parts = processedName.split(/\s+/);
      if (parts.length === 2) {
        // 如果有空格分隔，假设是"名 姓"格式，调整为"姓名"
        const [firstName, lastName] = parts;
        processedName = lastName + firstName;
      }
      // 如果没有空格，保持原样（可能已经是"姓名"格式）
    } else if (fieldMode === 0) {
      // 双栏模式：需要从DOM中获取firstName和lastName
      // 这种情况下originalName可能只是lastName或firstName的一部分
      // 需要在调用处处理完整的姓名组合
    }

    // 移除所有空格
    processedName = processedName.replace(/\s+/g, "");

    return {
      originalText: originalName,
      processedText: processedName,
      fieldMode: fieldMode,
    };
  }

  /**
   * 获取当前活动窗口的文档对象
   */
  private getActiveDocument(): Document | null {
    try {
      // 尝试获取主窗口
      const mainWindow = Zotero.getMainWindow();
      if (mainWindow && mainWindow.document) {
        return mainWindow.document;
      }

      // 尝试获取当前活动窗口
      const windows = Zotero.getWindows();
      for (const win of windows) {
        if (win.document && win.document.getElementById("zotero-item-pane")) {
          return win.document;
        }
      }

      return null;
    } catch (error) {
      ztoolkit.log("获取活动文档时出错:", error);
      return null;
    }
  }

  /**
   * 处理页面中的作者元素
   */
  private processCreatorElements(): void {
    try {
      const doc = this.getActiveDocument();
      if (!doc) return;

      // 获取当前选中的条目
      const selectedItems = Zotero.getActiveZoteroPane()?.getSelectedItems();
      if (!selectedItems || selectedItems.length === 0) return;

      const currentItem = selectedItems[0];
      if (!this.isChineseItem(currentItem)) return;

      // 获取条目的作者信息
      const creators = currentItem.getCreators();
      if (!creators || creators.length === 0) return;

      // 查找页面中的作者显示元素
      this.findAndProcessCreatorElements(doc, creators);
    } catch (error) {
      ztoolkit.log("处理作者元素时出错:", error);
    }
  }

  /**
   * 查找并处理页面中的作者元素
   */
  private findAndProcessCreatorElements(doc: Document, creators: any[]): void {
    // 可能的作者元素选择器
    const creatorSelectors = [
      '[data-field="creators"]',
      ".creators-box",
      ".creator-line",
      ".itembox-creators",
      '[class*="creator"]',
    ];

    for (const selector of creatorSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        this.processElementsWithSelector(elements, creators);
        break; // 找到匹配的元素后停止查找
      }
    }
  }

  /**
   * 处理特定选择器匹配的元素
   */
  private processElementsWithSelector(
    elements: NodeListOf<Element>,
    creators: any[],
  ): void {
    elements.forEach((element, index) => {
      if (this.processedElements.has(element)) return;

      try {
        // 查找文本节点或子元素
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((textNode, textIndex) => {
          if (textNode.nodeValue && textNode.nodeValue.trim()) {
            const creatorIndex = Math.min(index, creators.length - 1);
            const creator = creators[creatorIndex];

            if (creator) {
              const processed = this.processCreatorText(
                textNode.nodeValue,
                creator,
              );
              if (processed.processedText !== processed.originalText) {
                textNode.nodeValue = processed.processedText;
                ztoolkit.log(
                  `作者姓名已调整: "${processed.originalText}" -> "${processed.processedText}"`,
                );
              }
            }
          }
        });

        this.processedElements.add(element);
      } catch (error) {
        ztoolkit.log("处理单个作者元素时出错:", error);
      }
    });
  }

  /**
   * 处理作者文本
   */
  private processCreatorText(text: string, creator: any): ChineseNameProcessor {
    let fullName = "";

    if (creator.fieldMode === 1) {
      // 单栏模式
      fullName = creator.lastName || "";
    } else {
      // 双栏模式：组合firstName和lastName
      const firstName = creator.firstName || "";
      const lastName = creator.lastName || "";

      // 检查当前文本是否包含完整姓名
      if (text.includes(firstName) && text.includes(lastName)) {
        fullName = firstName + " " + lastName;
      } else {
        fullName = text; // 使用原始文本
      }
    }

    const processed = this.processChineseName(fullName, creator.fieldMode);

    // 替换原始文本中的姓名部分
    let result = text;
    if (
      processed.originalText &&
      processed.processedText !== processed.originalText
    ) {
      result = text.replace(processed.originalText, processed.processedText);
    }

    return {
      originalText: text,
      processedText: result,
      fieldMode: creator.fieldMode,
    };
  }

  /**
   * 获取元素中的所有文本节点
   */
  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim()) {
        textNodes.push(node as Text);
      }
    }

    return textNodes;
  }

  /**
   * 启动页面监听
   */
  public startObserving(): void {
    try {
      const doc = this.getActiveDocument();
      if (!doc) {
        // 延迟重试
        setTimeout(() => this.startObserving(), 1000);
        return;
      }

      // 立即处理一次
      this.processCreatorElements();

      // 设置监听器
      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            // 检查是否有新增的相关元素
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (
                  element.querySelector &&
                  (element.querySelector('[data-field="creators"]') ||
                    element.className.includes("creator") ||
                    element.id.includes("creator"))
                ) {
                  shouldProcess = true;
                }
              }
            });
          }
        });

        if (shouldProcess) {
          // 延迟处理，确保DOM更新完成
          setTimeout(() => this.processCreatorElements(), 100);
        }
      });

      // 监听整个文档的变化
      this.observer.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      ztoolkit.log("中文姓名显示监听器已启动");
    } catch (error) {
      ztoolkit.log("启动监听器时出错:", error);
    }
  }

  /**
   * 停止监听
   */
  public stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * 主要导出函数
 */

/**
 * 初始化中文姓名显示优化
 */
export function initChineseNameDisplay(): void {
  try {
    ztoolkit.log("开始初始化中文姓名显示优化...");

    const manager = ChineseNameDisplayManager.getInstance();

    // 延迟启动，确保界面完全加载
    setTimeout(() => {
      manager.startObserving();
    }, 500);

    ztoolkit.log("中文姓名显示优化初始化完成");
  } catch (error) {
    ztoolkit.log("初始化中文姓名显示优化时出错:", error);
  }
}

/**
 * 立即处理当前页面的中文姓名显示
 */
export function processCurrentPageChineseNames(): void {
  try {
    const manager = ChineseNameDisplayManager.getInstance();
    manager["processCreatorElements"](); // 调用私有方法进行处理
  } catch (error) {
    ztoolkit.log("处理当前页面中文姓名时出错:", error);
  }
}

/**
 * 停止中文姓名显示优化
 */
export function stopChineseNameDisplay(): void {
  try {
    const manager = ChineseNameDisplayManager.getInstance();
    manager.stopObserving();
    ztoolkit.log("中文姓名显示优化已停止");
  } catch (error) {
    ztoolkit.log("停止中文姓名显示优化时出错:", error);
  }
}

// 兼容旧版本的函数名
export const applyChineseNameDisplayFix = initChineseNameDisplay;
