<template>
    <div>
        <div >
            <div class="show">
                <h1>ABCToken合约信息</h1>
                <br /> Token地址 : {{ erc20Address  }}
                <br /> Token名称 : {{ name  }}
                <br /> Token符号 : {{  symbol }}
                <br /> Token精度 : {{  decimal }}
                <br /> Token发行量 : {{  supply }}
                <hr>
                <br /> 我当前的钱包 : {{ account  }}
                <br /> 我的ABC余额 : {{ balance  }}
                
            </div>

            <div class="transfer">
                <h2>合约增发</h2>
                <br />增发到:
                <input type="text" v-model="addTo" />
                <br />增发金额
                <input type="text" v-model="addAmount" />
                <br />
                <button @click="deposite()"> 增发 </button>
            </div>

            <div class="transfer">
                <h2>转账</h2>
                <br />转账到:
                <input type="text" v-model="transferTo" />
                <br />转账金额
                <input type="text" v-model="transferAmount" />
                <br />
                <button @click="transfer()"> 转账 </button>
            </div>

            <div class="transfer">
                <h2>授权</h2>
                <br />授权到:
                <input type="text" v-model="approveTo" />
                <br />授权金额
                <input type="text" v-model="approveAmount" />
                <br />
                <button @click="approve()"> 授权 </button>
            </div>

            <div class="transfer">
                <h2>授权查询</h2>
                <br />授权地址:
                <input type="text" v-model="who" />
                <button @click="getAllowance()"> 查询授权余额 </button>
                <br />
                <br /> 我的对{{who}}的授权余额为 : {{ remaindAmount  }}
                <br />
            </div>


        </div>
    </div>
</template>

<script>
import {ethers} from "ethers"
import erc20Addr from "../../../deployments/dev/ABCToken.json"
import erc20Abi from "../../../deployments/abi/ABCToken.json"

export default ({
    name:"ERC20",
    data(){
        return{
            addTo: null,
            addAmount: null,

            transferTo: null,
            transferAmount: null,

            approveTo: null,
            approveAmount: null,

            who: null,              // 授权给who
            remaindAmount: null,    // 剩余的授权金额

            account: null,    // 当前账户地址
            balance: null,          // 当前账户ABC余额   

            name: null,         
            decimal: null,
            symbol: null,
            supply: null,

            erc20Address: null,
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
            this.erc20Token = new ethers.Contract(erc20Addr.address, 
                erc20Abi, this.signer);
            this.erc20Address = this.erc20Token.address;
        },

        getInfo() {
            this.erc20Token.name().then((r) => {
                this.name = r;
            })
            this.erc20Token.decimals().then((r) => {
                this.decimal = r;
            })
            this.erc20Token.symbol().then((r) => {
                this.symbol = r;
            })
            this.erc20Token.totalSupply().then((r) => {
                this.supply = ethers.utils.formatUnits(r, 18);
            })
            this.erc20Token.balanceOf(this.account).then((r) => {
                this.balance = ethers.utils.formatUnits(r, 18);
            })
        },

        deposite(){
            let amount = ethers.utils.parseUnits(this.addAmount, 18);
            this.erc20Token.deposite(this.addTo, amount).then((r) => {
                console.log(r);  
                this.getInfo();
            })
        },

        transfer() {
            let amount = ethers.utils.parseUnits(this.transferAmount, 18);
            this.erc20Token.transfer(this.transferTo, amount).then((r) => {
                console.log(r);  
                this.getInfo();
            })
        },

        approve() {
            let amount = ethers.utils.parseUnits(this.approveAmount, 18);
            this.erc20Token.approve(this.approveTo, amount).then((r) => {
                console.log(r);  
                this.getInfo();
            })
        },

        getAllowance() {
            let whoAddr = ethers.utils.getAddress(this.who);
            this.erc20Token.allowance(this.account, whoAddr).then((r) => {
                this.remaindAmount = ethers.utils.formatUnits(r, 18);
            })
        },

    },

})
</script>

<style scoped>
.show{
    text-align: left;
}
.transfer{
    width: 200px;
    display: inline;
}
</style>
