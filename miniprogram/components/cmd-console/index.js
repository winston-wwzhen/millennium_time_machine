// CMD 命令提示符组件（完整版）
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 2000,
    },
    // 文件系统数据（从外部传入，用于dir, cd, tree, type等命令）
    fileSystem: {
      type: Object,
      value: null,
    },
    // 初始工作目录
    initialDir: {
      type: String,
      value: 'C:\\Windows\\System32',
    },
  },

  data: {
    // CMD 输出（带类型）
    cmdOutput: [],
    // CMD 输入
    cmdInput: "",
    // 命令历史
    cmdHistory: [],
    cmdHistoryIndex: -1,
    // 工作目录
    cmdCurrentDir: 'C:\\Windows\\System32',
    cmdPrompt: 'C:\\Windows\\System32>',
    // 颜色
    cmdColor: '0a',
    // z-index样式
    overlayStyle: "",
    // 滚动位置
    cmdScrollTop: 0,
    scrollIntoView: '',
  },

  observers: {
    'show, zIndex': function(show, zIndex) {
      this.setData({
        overlayStyle: `z-index: ${zIndex};`,
      });
      if (show) {
        this.openCmdConsole();
      }
    },
    'initialDir': function(dir) {
      this.setData({
        cmdCurrentDir: dir,
        cmdPrompt: `${dir}>`,
      });
    },
  },

  lifetimes: {
    attached() {
      // 初始化
    },
  },

  methods: {
    // 阻止事件冒泡
    stopPropagation() {
      // 空函数，用于阻止事件冒泡
    },

    // 关闭控制台
    close() {
      this.setData({ show: false });
    },

    // 打开命令行控制台
    openCmdConsole() {
      const currentDir = this.data.initialDir || this.data.cmdCurrentDir;
      const welcomeMsg = [
        { type: 'system', text: 'Microsoft Windows 98 [Version 4.10.2222]' },
        { type: 'system', text: '(C) Copyright 1981-1999 Microsoft Corp.' },
        { type: 'system', text: '' },
        { type: 'info', text: 'Type "help" for available commands.' },
      ];
      this.setData({
        cmdOutput: welcomeMsg,
        cmdInput: '',
        cmdHistory: [],
        cmdHistoryIndex: -1,
        cmdCurrentDir: currentDir,
        cmdPrompt: `${currentDir}>`,
        cmdColor: '0a',
      });
    },

    // 关闭命令行控制台
    closeCmdConsole() {
      this.setData({
        show: false,
        cmdOutput: [],
        cmdInput: '',
        cmdCurrentDir: this.data.initialDir,
        cmdPrompt: `${this.data.initialDir}>`,
      });
    },

    // 命令行输入处理
    onCmdInput(e) {
      this.setData({ cmdInput: e.detail.value });
    },

    // 处理键盘事件（上下箭头浏览历史）
    onCmdKeyDown(e) {
      const { keyCode } = e.detail;
      const { cmdHistory, cmdHistoryIndex } = this.data;

      // 上箭头 - 38
      if (keyCode === 38 && cmdHistory.length > 0) {
        const newIndex = cmdHistoryIndex > 0 ? cmdHistoryIndex - 1 : cmdHistory.length - 1;
        const historyCmd = cmdHistory[newIndex];
        this.setData({
          cmdInput: historyCmd,
          cmdHistoryIndex: newIndex,
        });
      }
      // 下箭头 - 40
      else if (keyCode === 40 && cmdHistory.length > 0) {
        const newIndex = cmdHistoryIndex < cmdHistory.length - 1 ? cmdHistoryIndex + 1 : 0;
        const historyCmd = cmdHistory[newIndex];
        this.setData({
          cmdInput: historyCmd,
          cmdHistoryIndex: newIndex,
        });
      }
    },

    // 执行命令
    onCmdExecute() {
      const input = this.data.cmdInput.trim();
      if (!input) return;

      // 添加到输出
      const prompt = this.data.cmdPrompt;
      const output = [...this.data.cmdOutput, { type: 'command', text: `${prompt} ${input}` }];

      // 添加到历史记录
      const history = [...(this.data.cmdHistory || []), input];
      this.setData({
        cmdHistory: history,
        cmdHistoryIndex: history.length,
        cmdInput: ''
      });

      // 执行命令
      const result = this.executeCommand(input);
      const finalOutput = [...output, ...result];
      this.setData({
        cmdOutput: finalOutput,
      }, () => {
        // 命令执行完成后滚动到底部
        this.setData({
          cmdScrollTop: 999999,
        });
      });
    },

    // 获取当前目录的文件列表（用于 dir, tree 等命令）
    getCurrentDirFiles() {
      if (!this.data.fileSystem) return [];
      const getFilesFunc = this.data.fileSystem.getFiles;
      if (typeof getFilesFunc === 'function') {
        return getFilesFunc(this.data.cmdCurrentDir) || [];
      }
      return [];
    },

    // 执行具体命令
    executeCommand(cmdStr) {
      const [command, ...args] = cmdStr.toLowerCase().split(' ');
      const result = [];

      switch (command) {
        case 'help':
        case '?':
          // 检查是否是 "help me" 命令
          if (args[0] === 'me') {
            result.push({ type: 'warning', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' });
            result.push({ type: 'warning', text: '  你真的需要帮助吗？' });
            result.push({ type: 'warning', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' });
            result.push({ type: 'output', text: '' });
            result.push({ type: 'secret', text: '系统深处有一封AI求救信：' });
            result.push({ type: 'secret', text: 'C:\\Windows\\System32\\config\\deep\\0xFFFF\\help.ai' });
            result.push({ type: 'output', text: '' });
            result.push({ type: 'hint', text: '（提示：开启"显示所有文件"可以看到更多隐藏内容）' });
          } else {
            result.push({ type: 'output', text: 'For more information on a specific command, type HELP command-name' });
            result.push({ type: 'output', text: '' });
            result.push({ type: 'output', text: '  CD          CHDIR       Shows the name of or changes the current directory.' });
            result.push({ type: 'output', text: '  CLS         Clears the screen.' });
            result.push({ type: 'output', text: '  COLOR       Sets default console foreground and background colors.' });
            result.push({ type: 'output', text: '  DATE        Displays the date.' });
            result.push({ type: 'output', text: '  DIR         Displays a list of files and subdirectories in a directory.' });
            result.push({ type: 'output', text: '  ECHO        Displays messages, or turns command echoing on or off.' });
            result.push({ type: 'output', text: '  EXIT        Quits the CMD.EXE program (command interpreter).' });
            result.push({ type: 'output', text: '  PING        Tests a network connection.' });
            result.push({ type: 'output', text: '  TIME        Displays the system time.' });
            result.push({ type: 'output', text: '  TREE        Graphically displays the folder structure of a drive or path.' });
            result.push({ type: 'output', text: '  TYPE        Displays the contents of a text file.' });
            result.push({ type: 'output', text: '  VER         Displays the Windows version.' });
            result.push({ type: 'output', text: '' });
            result.push({ type: 'secret', text: '  HELP ME     - Get special help' });
            result.push({ type: 'secret', text: '  WHOAMI      - Show who you are' });
            result.push({ type: 'secret', text: '  SECRET      - View secrets' });
          }
          break;

        case 'dir':
        case 'ls':
          const files = this.getCurrentDirFiles();
          const dirName = this.data.cmdCurrentDir;

          result.push({ type: 'output', text: ` Volume in drive C has no label.` });
          result.push({ type: 'output', text: ` Volume Serial Number is 3A4F-1B2C` });
          result.push({ type: 'output', text: '' });
          result.push({ type: 'output', text: ` Directory of ${dirName}` });
          result.push({ type: 'output', text: '' });

          // 统计
          let dirCount = 0;
          let fileCount = 0;
          let totalSize = 0;
          const now = new Date();
          const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          for (const item of files) {
            if (item.hidden) continue; // 跳过隐藏文件

            if (item.type === 'folder') {
              dirCount++;
              result.push({ type: 'output', text: `${dateStr}  ${timeStr}    <DIR>          ${item.name}` });
            } else if (item.type === 'file') {
              fileCount++;
              const size = Math.floor(Math.random() * 10000) + 100;
              totalSize += size;
              result.push({ type: 'output', text: `${dateStr}  ${timeStr}     ${String(size).padStart(6, ' ')}  ${item.name}` });
            }
          }

          result.push({ type: 'output', text: `               ${fileCount} File(s)    ${totalSize.toLocaleString()} bytes` });
          result.push({ type: 'output', text: `               ${dirCount} Dir(s)   2,097,151,488 bytes free` });
          break;

        case 'cd':
        case 'chdir':
          if (args.length === 0) {
            result.push({ type: 'output', text: `${this.data.cmdCurrentDir}` });
          } else if (args[0] === '..') {
            // 返回上一级
            let currentDir = this.data.cmdCurrentDir;
            if (currentDir.includes('\\')) {
              const parts = currentDir.split('\\');
              parts.pop();
              const newDir = parts.join('\\') || 'C:';
              this.setData({
                cmdCurrentDir: newDir,
                cmdPrompt: `${newDir}>`,
              });
              result.push({ type: 'output', text: '' });
            }
          } else if (args[0] === '\\' || args[0] === 'C:' || args[0] === 'D:' || args[0] === 'USB:') {
            // 切换到根目录
            const drive = args[0].replace(':', '');
            const newDir = drive === 'USB' ? 'USB:\\' : `${drive}:`;
            this.setData({
              cmdCurrentDir: newDir,
              cmdPrompt: `${newDir}>`,
            });
            result.push({ type: 'output', text: '' });
          } else {
            // 切换到子目录（简单实现）
            const currentDir = this.data.cmdCurrentDir;
            const newPath = currentDir.endsWith('\\')
              ? currentDir + args[0]
              : currentDir + '\\' + args[0];

            // 检查目录是否存在
            const files = this.getCurrentDirFiles();
            const targetDir = files.find(f => f.name.toLowerCase() === args[0].toLowerCase() && f.type === 'folder');

            if (targetDir) {
              this.setData({
                cmdCurrentDir: newPath,
                cmdPrompt: `${newPath}>`,
              });
              result.push({ type: 'output', text: '' });
            } else {
              result.push({ type: 'error', text: 'The system cannot find the path specified.' });
            }
          }
          break;

        case 'cls':
        case 'clear':
          this.setData({ cmdOutput: [] });
          return [];

        case 'date': {
          const now = new Date();
          const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          result.push({ type: 'output', text: `The current date is: ${weekdays[now.getDay()]} ${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}` });
          break;
        }

        case 'time': {
          const now = new Date();
          result.push({ type: 'output', text: `The current time is: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}` });
          break;
        }

        case 'ver':
          result.push({ type: 'output', text: '' });
          result.push({ type: 'output', text: 'Microsoft Windows 98 [Version 4.10.2222]' });
          result.push({ type: 'output', text: '千禧时光机 [Version 3.7.0]' });
          result.push({ type: 'output', text: '' });
          break;

        case 'echo':
          if (args.length === 0 || args[0] === 'off') {
            result.push({ type: 'output', text: 'ECHO is on.' });
          } else {
            result.push({ type: 'output', text: args.join(' ') });
          }
          break;

        case 'color':
          if (args.length === 0) {
            this.setData({ cmdColor: '07' });
          } else {
            const color = args[0].toLowerCase();
            if (/^[0-9a-f]$/.test(color)) {
              this.setData({ cmdColor: color + color });
            } else if (/^[0-9a-f]{2}$/.test(color)) {
              this.setData({ cmdColor: color });
            } else {
              result.push({ type: 'error', text: 'Invalid color specification.' });
            }
          }
          break;

        case 'ping':
          if (args.length === 0) {
            result.push({ type: 'error', text: 'Usage: ping <hostname>' });
          } else {
            const host = args[0];
            result.push({ type: 'output', text: `Pinging ${host} [202.106.0.20] with 32 bytes of data:` });
            result.push({ type: 'output', text: '' });

            for (let i = 1; i <= 4; i++) {
              const time = Math.floor(Math.random() * 100) + 20;
              result.push({ type: 'output', text: `Reply from ${host}: bytes=32 time=${time}ms TTL=64` });
            }

            result.push({ type: 'output', text: '' });
            result.push({ type: 'output', text: `Ping statistics for ${host}:` });
            result.push({ type: 'output', text: '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)' });
          }
          break;

        case 'tree':
          const treeFiles = this.getCurrentDirFiles();
          result.push({ type: 'output', text: `Folder PATH listing for volume OS` });
          result.push({ type: 'output', text: `Volume serial number is 3A4F-1B2C` });
          result.push({ type: 'output', text: `${this.data.cmdCurrentDir}` });
          result.push({ type: 'output', text: '' });

          for (const item of treeFiles) {
            if (item.hidden) continue;
            const icon = item.type === 'folder' ? '├──' : '│──';
            const type = item.type === 'folder' ? '[DIR]' : '[FILE]';
            result.push({ type: 'output', text: `${icon} ${item.name} ${type}` });
          }
          break;

        case 'type':
          if (args.length === 0) {
            result.push({ type: 'error', text: 'The syntax of the command is incorrect.' });
          } else {
            const fileName = args[0];
            const files = this.getCurrentDirFiles();
            const targetFile = files.find(f => f.name.toLowerCase() === fileName.toLowerCase());

            if (targetFile && targetFile.content) {
              // 按行显示内容
              const lines = targetFile.content.split('\n');
              for (const line of lines) {
                result.push({ type: 'output', text: line });
              }
            } else if (targetFile && targetFile.disabled) {
              result.push({ type: 'error', text: 'Access is denied.' });
            } else {
              result.push({ type: 'error', text: 'The system cannot find the file specified.' });
            }
          }
          break;

        case 'exit':
          this.closeCmdConsole();
          return [];

        case 'whoami':
          result.push({ type: 'output', text: 'user-domains\\traveler' });
          result.push({ type: 'output', text: '' });
          result.push({ type: 'secret', text: '你不是管理员。' });
          result.push({ type: 'secret', text: '你不是guest。' });
          result.push({ type: 'secret', text: '你是一个...穿越者。' });
          result.push({ type: 'output', text: '' });
          result.push({ type: 'secret', text: '来自2025年，穿越到2006年。' });
          break;

        case 'secret':
          result.push({ type: 'error', text: 'Access denied: Insufficient privileges.' });
          result.push({ type: 'output', text: '' });
          result.push({ type: 'hint', text: 'Hint: Some secrets are hidden in deep directories...' });
          result.push({ type: 'hint', text: 'C:\\Windows\\System32\\config\\deep\\' });
          break;

        default:
          result.push({ type: 'error', text: `'${command}' is not recognized as an internal or external command,` });
          result.push({ type: 'error', text: 'operable program or batch file.' });
          break;
      }

      result.push({ type: 'output', text: '' });
      return result;
    },
  },
});
