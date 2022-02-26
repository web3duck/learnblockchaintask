const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Should return the new value of counter", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.deployed();
    //用默认getter()获取counter,初始值应该为0
    expect(await counter.counter()).to.equal(0);

    const funcCountTx = await counter.count();
    // wait until the transaction is mined
    await funcCountTx.wait();
    expect(await counter.counter()).to.equal(1);

    const funcAddTx = await counter.add(100);
    await funcAddTx.wait();
    expect(await counter.counter()).to.equal(101);
  });
});
