souche-f2e-service
==================

大搜车前端本地和测试环境 assets托管服务。


思路基于云环境的思路，开发者本地逻辑轻，而在测试和发布时重逻辑，与传统的前端资源管理不同，更动态更灵活更云端。

clone 下来。

npm install

然后修改config.js 指定assets和demo路径

node app.js 即可启动服务。

用less管理样式，用jade管理demo。


###具体使用？

用来管理样式和demo。跑起来后就不用重启，然后用nginx把域名指向到此端口，本地和测试服务器都可以跑，开发的时候用host切换即可。