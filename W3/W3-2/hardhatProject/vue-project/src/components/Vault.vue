<template>
    <div>
        <div >
            <div class="show">
                <h1>Vault合约信息</h1>
                <br /> Vault合约地址 : {{ vaultAddress  }}
                <br /> 当前交互的ERC20 Token合约地址 : {{ erc20Address  }}
                <hr>
                <br /> 我当前的钱包 : {{ account  }}
                <br /> 我在Vault合约中的ABC余额 : {{ balance  }}
                
            </div>

            <div class="transfer">
                <h2>存token进Vault</h2>
                <br />金额
                <input type="text" v-model="depositeAmount" />
                <br />
                <button @click="deposite()"> 存款 </button>
            </div>

            <div class="transfer">
                <h2>从Vault合约取款</h2>
                <br />金额
                <input type="text" v-model="withdrawAmount" />
                <br />
                <button @click="withdraw()"> 转账 </button>
            </div>

        </div>
    </div>
</template>

<script>
import {ethers} from "ethers"
import vaultAddr from "../../../deployments/dev/Vault.json"
import vaultAbi from "../../../deployments/abi/Vault.json"

import erc20Addr from "../../../deployments/dev/ABCToken.json"

export default ({
    name:"ERC20",
    data(){
        return{
            erc20Address: erc20Addr.address,        // 这里直接设定好ABCToken合约地址
            depositeAmount: null,   // 存款金额
            withdrawAmount: null,   // 取款金额
            account: null,          // 当前钱包账户
            balance: null,          // 当前账户Token余额
            vaultAddress: null,
        }
    },

    async created(){
        await this.initAccount()
        this.initContract()
        this.getInfo();
    },

    methods:{
        async initAccount(){
            if(window.ethereum) {
                console.log("initAccount");
                try{
                    this.accounts = await window.ethereum.enable()
                    console.log("accounts:" + this.accounts);
                    this.account = this.accounts[0];
                    this.currProvider = window.ethereum;
                    this.provider = new ethers.providers.Web3Provider(window.ethereum);

                    this.signer = this.provider.getSigner()
                    let network = await this.provider.getNetwork()
                    this.chainId = network.chainId;
                    console.log("chainId:", this.chainId);

                } catch(error){
                    console.log("User denied account access", error)
                }
            }else{
                console.log("Need install MetaMask")
            }
        },

        async initContract() {
            // vault合约实例
            this.vault = new ethers.Contract(vaultAddr.address, 
                vaultAbi, this.signer);

            this.vaultAddress = this.vault.address;
        },

        getInfo() {
            this.vault.getBalance(this.account).then(r => {
                this.balance = ethers.utils.formatUnits(r, 18);
                console.log(this.balance);
            });
        },
        // 授权转账
        // deposite(){
        //     let amount = ethers.utils.parseUnits(this.depositeAmount, 18);
        //     this.vault.deposite(this.erc20Address, amount).then((r) => {
        //         console.log(r);  
        //         this.getInfo();     
        //     })
        // },
        async deposite(){
            let amount = ethers.utils.parseUnits(this.depositeAmount, 18);
            const tx = await this.vault.deposite(this.erc20Address, amount);
            await tx.wait();
            // 等待交易完成后再更新网页balance的值
            this.getInfo();
        },
        // 取钱
        withdraw() {
            let amount = ethers.utils.parseUnits(this.withdrawAmount, 18);
            this.vault.withdraw(this.erc20Address, amount).then((r) => {
                console.log(r);  
                this.getInfo();     
            })
        },

    },

})
</script>

<style scoped>
.show{
    text-align: center;
}
.transfer{
    width: 200px;
    display: inline;
}
</style>
