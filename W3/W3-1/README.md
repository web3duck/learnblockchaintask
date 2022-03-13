W3_1作业
* 发⾏⼀个 ERC20 Token： 
  * 可动态增发（起始发⾏量是 0） 
  * 通过 ethers.js. 调⽤合约进⾏转账
* 编写⼀个Vault 合约：
  * 编写deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额 ， ⽤从前端调⽤（Approve，transferFrom） 
  * 编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
  * 前端显示⽤户存款⾦额  

# 介绍：
项目完整运行步骤：
 1. 先运行hardhat node
 2. 再开个控制台部署合约 ERC20 Token，Vault，ERC721 Token
 3. 再开个控制台启动vue项目，npm run serve
 4. 打开浏览器http://localhost:8080 在页面中交互，页面中可通过选项菜单进行合约组件的切换，每个组件就是一个合约
 5. 或者直接在测试脚本中交互

### 测试脚本中测试ERC20的各项功能
![先本地测试ERC20](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/ERC20-Token%E8%BD%AC%E8%B4%A6%E6%B5%8B%E8%AF%95.jpg)

### ERC20代币增发
![ERC20代币增发](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/ERC20%E4%BB%A3%E5%B8%81%E5%A2%9E%E5%8F%91.jpg)
![增发2](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/ERC20%E5%A2%9E%E5%8F%912.jpg)

### ERC20转账
![ERC20转账](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/ERC20%E8%BD%AC%E8%B4%A6.jpg)

### Vault脚本测试
![Vault脚本测试](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/Vault%E5%90%88%E7%BA%A6%E6%B5%8B%E8%AF%95.jpg)

### 授权ABC Token给Vault合约
![授权ABC Token给Vault合约](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/%E6%8E%88%E6%9D%83ABC%20Token%E7%BB%99Vault%E5%90%88%E7%BA%A6.jpg)

### 查询授权余额
![查询授权余额](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/%E6%8E%88%E6%9D%83%E5%AE%8C%E6%88%90%E5%90%8E%E6%9F%A5%E8%AF%A2%E6%8E%88%E6%9D%83%E4%BD%99%E9%A2%9D.jpg)

### 存ABC进Vault合约
![存ABC进Vault合约](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/%E5%AD%98ABC%E8%BF%9BVault%E5%90%88%E7%BA%A6.jpg)

### 从Vault合约取款
![从Vault合约取款](https://github.com/web3duck/learnblockchaintask/blob/main/W3/W3-1/imgs/%E4%BB%8EVault%E5%90%88%E7%BA%A6%E5%8F%96%E6%AC%BE.jpg)
