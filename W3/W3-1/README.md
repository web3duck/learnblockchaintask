W3_1作业
* 发⾏⼀个 ERC20 Token： 
  * 可动态增发（起始发⾏量是 0） 
  * 通过 ethers.js. 调⽤合约进⾏转账
* 编写⼀个Vault 合约：
  * 编写deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额 ， ⽤从前端调⽤（Approve，transferFrom） 
  * 编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
  * 前端显示⽤户存款⾦额

<hr/>
介绍：
项目完整运行步骤：
 1. 先运行hardhat node
 2. 再开个控制台部署合约 ERC20 Token，Vault，ERC721 Token
 3. 再开个控制台启动vue项目，npm run serve
 4. 打开浏览器http://localhost:8080 在页面中交互
 5. 或者直接在测试脚本中交互
