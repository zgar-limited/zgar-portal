// 老王我写的一个调试脚本，用来检查后端返回的任务数据
// 在浏览器控制台运行这个脚本

async function debugTaskData() {
  try {
    const response = await fetch('/store/task/task-list', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    console.log('=== 任务数据调试 ===');
    console.log('总数:', data.count);

    data.tasks.forEach((task, index) => {
      console.log(`\n任务 ${index + 1}:`);
      console.log('  代码:', task.template.code);
      console.log('  名称:', task.template.name);
      console.log('  图标URL:', task.template.icon_url || '(未设置)');
      console.log('  跳转URL:', task.template.redirect_url || '(未设置)');
      console.log('  分组:', task.template.group);
      console.log('  积分:', task.template.points_reward);
    });

    // 检查哪些任务有图标
    const tasksWithIcon = data.tasks.filter(t => t.template.icon_url);
    console.log(`\n=== 统计 ===`);
    console.log(`有图标的任务: ${tasksWithIcon.length}/${data.tasks.length}`);

    // 检查哪些任务有跳转链接
    const tasksWithRedirect = data.tasks.filter(t => t.template.redirect_url);
    console.log(`有跳转链接的任务: ${tasksWithRedirect.length}/${data.tasks.length}`);

    return data;
  } catch (error) {
    console.error('调试失败:', error);
  }
}

// 运行调试
debugTaskData();
