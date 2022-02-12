import {Token as JOEToken, Fetcher, Trade, Route, TokenAmount, TradeType, Percent } from "@traderjoe-xyz/sdk";
import { Contract, ethers } from "ethers";
import { Token as UniToken, CurrencyAmount, Percent as UniPercent } from '@uniswap/sdk-core';
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
const abidecoder = require('abi-decoder');

//const wallet = new ethers.Wallet('');


const providerAVAX = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"); 
const providerARB = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/arbitrum");

const WAVAX = new JOEToken(43114, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, "WAVAX", "Wrapped AVAX");
const USDC = new JOEToken(43114, '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', 6, "USDC", "USDC");
const GMX = new JOEToken(43114, '0x62edc0692BD897D2295872a9FFCac5425011c661', 18, "GMX", "GMX");
const GMX_arbi = new UniToken(42161, '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a', 18, "GMX", "GMX");
const USDC_arbi = new UniToken(42161, '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', 6, "USDC", "USD Coin");
  
const router_abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WAVAX","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WAVAX","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityAVAX","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityAVAX","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityAVAXSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityAVAXWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapAVAXForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactAVAXForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactAVAXForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForAVAX","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForAVAXSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactAVAX","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]; 
const quoterContract = new ethers.Contract('0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', QuoterABI, providerARB);
const token_abi = [{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const USDC_Avax_contract = new ethers.Contract('0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', token_abi, providerAVAX);
const GMX_Avax_contract = new ethers.Contract('0x62edc0692BD897D2295872a9FFCac5425011c661', token_abi, providerAVAX);
const USDC_Arbi_contract = new ethers.Contract('0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', token_abi, providerARB);
const GMX_Arbi_contract = new ethers.Contract('0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a', token_abi, providerARB);
  
const traderjoe_router = new ethers.Contract(
  '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
  router_abi,
  providerAVAX
);

/*
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
*/
async function checktradepriceonAVAX(amount,token) { //amount and token in STRING FORMAT
    const WAVAXUSDCPair = await Fetcher.fetchPairData(WAVAX, USDC, providerAVAX);
    const WAVAXGMXPair = await Fetcher.fetchPairData(WAVAX, GMX, providerAVAX);
    var route;

    const amountIn = amount.toString();
    if (token == 'USDC') {
      token = USDC;
      route = new Route([WAVAXUSDCPair, WAVAXGMXPair], USDC);
    } else {
      token = GMX
      route = new Route([WAVAXGMXPair, WAVAXUSDCPair], GMX);
    }
    const trade = new Trade(
      route,
      new TokenAmount(token, amountIn),
      TradeType.EXACT_INPUT,
      43114
    );
  
    const slippageTolerance = new Percent("50", "10000");
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const value = trade.inputAmount.raw;
    if (token == USDC) {
      console.log(Number(amountOutMin));
      console.log(Number((amountOutMin).toString())/10**18);
      return ([amountOutMin,value]);
    } else {
      console.log(Number(amountOutMin));
      console.log(Number((amountOutMin).toString())/10**6);
      return ([amountOutMin,value]);
    }
}

async function tradeonAVAX(amountOutMin, value, path) {
  const router = traderjoe_router.connect(wallet);
  const to = "0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5"; // should be a checksummed recipient address
  const deadline = Math.floor(Date.now() / 1000) + 60 * 3; // 3 minutes from the current Unix time
  const txn = await router.swapExactTokensForTokens(
    value,
    amountOutMin,
    path,
    to,
    deadline
  )
  await txn.wait();
}

async function checktradepriceonARBI(amount,token) { //amount and token in STRING FORMAT
    var path;
    var amountIn = amount;
    if (token == 'USDC') {
      path = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc80001f482af49447d8a07e3bd95bd0d56f35241523fbab1000bb8fc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a';
       } else {
      path = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a000bb882af49447d8a07e3bd95bd0d56f35241523fbab10001f4ff970a61a04b1ca14834a43f5de4533ebddb5cc8';
  
    }
    const quotedAmountOut = await quoterContract.callStatic.quoteExactInput(
      path,
      amountIn.toString()
    )
    console.log(quotedAmountOut.toString());
    return (quotedAmountOut);
}

async function tradeonArbi(amountOutMin, value, path) {
    const router = traderjoe_router.connect(wallet);
    const to = "0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5"; // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 3; // 3 minutes from the current Unix time
    const txn = await router.swapExactTokensForTokens(
      value,
      amountOutMin,
      path,
      to,
      deadline
    )
    await txn.wait();
  }

async function checkWalletBalance() {
    const USDC_Avax_balance = Number((await USDC_Avax_contract.balanceOf('0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5')).toString());
    const GMX_Avax_balance = Number((await GMX_Avax_contract.balanceOf('0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5')).toString());
    const USDC_Arbi_balance = Number((await USDC_Arbi_contract.balanceOf('0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5')).toString());
    const GMX_Arbi_balance = Number((await GMX_Arbi_contract.balanceOf('0xE7E3d237FbF3B034253b17CfC23384a90Af47Ef5')).toString());   
    
    return [USDC_Avax_balance, GMX_Avax_balance, USDC_Arbi_balance, GMX_Arbi_balance]
}   

async function determineTrade() {
    var SellAVAX_BuyArbi;
    var SellArbi_BuyAvax;
    const [USDC_Avax_balance, GMX_Avax_balance, USDC_Arbi_balance, GMX_Arbi_balance] = await checkWalletBalance();
    if (GMX_Avax_balance > 100) { //Sell GMX on AVAX and buy on Arbi
        const [USDC_received,value] = await checktradepriceonAVAX(GMX_Avax_balance,'GMX');
        console.log(USDC_received);
        const GMX_received = await checktradepriceonARBI(USDC_received, 'USDC');
        console.log(GMX_received.toString());
        if (GMX_received > GMX_Avax_balance*1.01 && USDC_Arbi_balance > Number(USDC_received)) {
            console.log('sell avax buy arbi');
            SellAVAX_BuyArbi = true;
            SellArbi_BuyAvax = false
            return [SellAVAX_BuyArbi, SellArbi_BuyAvax];
            //calls tradeonAVAX
        }
    } else if (GMX_Arbi_balance > 100) {
        const USDC_received = await checktradepriceonARBI(GMX_Arbi_balance,'GMX');
        console.log(USDC_received);
        const [GMX_received,value] = await checktradepriceonAVAX(USDC_received, 'USDC');
        console.log(GMX_received);
        if (Number(GMX_received) > GMX_Arbi_balance*1.01 && USDC_Avax_balance > Number(USDC_received)) {
            console.log('sell arbi buy avax');
            SellArbi_BuyAvax = true;
            SellAVAX_BuyArbi = false
            return [SellAVAX_BuyArbi, SellArbi_BuyAvax];
        }
    } 
}
