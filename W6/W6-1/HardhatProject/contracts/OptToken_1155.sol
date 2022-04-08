//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract OptToken_1155 is ERC1155, Ownable {
    using SafeERC20 for IERC20;
    // 期权
    struct OptInfo {
        uint256 price; // 到期执行价格
        uint256 settlementTime; // 行权时间
    }
    // 期权数组
    OptInfo[] public OptInfoArr;
    // 行权有效期
    uint256 public constant during = 3 days;
    address public usdcToken;

    constructor(address _usdcAddr) ERC1155("") {
        usdcToken = _usdcAddr;
    }

    receive() external payable {}

    // 发行期权
    function mint(uint256 days_, uint256 price_) external payable onlyOwner {
        uint256 _executeTime = uint256(block.timestamp) + days_; // days天后可行权
        uint256 _tokenId = OptInfoArr.length; // tokenId 为数组index

        OptInfoArr.push(OptInfo({price: price_, settlementTime: _executeTime}));

        _mint(msg.sender, _tokenId, msg.value, "");
    }

    // 用户行权
    function settlement(uint256 _tokenId, uint256 amount) external {
        require(
            block.timestamp >= OptInfoArr[_tokenId].settlementTime &&
                block.timestamp < OptInfoArr[_tokenId].settlementTime + during,
            "invalid time"
        );

        // 销毁期权token
        _burn(msg.sender, _tokenId, amount);

        uint256 needUsdcAmount = OptInfoArr[_tokenId].price * amount;
        IERC20(usdcToken).safeTransferFrom(
            msg.sender,
            address(this),
            needUsdcAmount
        );

        safeTransferETH(msg.sender, amount);
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(
            success,
            "TransferHelper::safeTransferETH: ETH transfer failed"
        );
    }

    // 遍历期权数组，销毁过期期权
    function burn() external onlyOwner {
        for (uint256 i = 0; i < OptInfoArr.length; ++i) {
            if (
                uint256(block.timestamp) >=
                OptInfoArr[i].settlementTime + during
            ) {
                _remove(i);
            }
        }
    }

    function _remove(uint index) internal {
        uint len = OptInfoArr.length;
        if (index == len - 1) {
            // 如果要删除的是最后一个元素，直接pop()
            OptInfoArr.pop();
        } else {
            // 要删除中间元素，把最后的元素放在这里替换，再删掉最后的元素
            OptInfoArr[index] = OptInfoArr[len - 1];
            OptInfoArr.pop();
        }
    }
}
