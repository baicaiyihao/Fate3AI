import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import CreateProfile from "./components/createProfile";
import CheckIn from "./components/checkIn";
import Getuserinfo from "./components/getUserProfile";
import AddAdmin from "./components/addAdmin";
import SetItemsPrice from "./components/setItemPrice";
import BuyItem from "./components/buyItems";
import UsdToSuiConverter from "./components/UsdToSuiConverter";
import SetTokenPrice from "./components/setTokenPrice";
import CreateRaffle from "./components/createRaffle";
import SetRaffle from "./components/setRaffle";
import Lottery from "./components/lottery";
import SetRaffleNft from "./components/setRaffleNft";
import TarotReading from "./components/tarotReading";
import Test from "./components/createRaffle";
function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <h1>用户功能</h1>
        <br />
        <h2>创建用户</h2>
        <span>输入一个用户名之类的创建</span>
        <CreateProfile />

        <br />
        <h2>用户信息</h2>
        <Getuserinfo /> 

        <br />
        <h2>签到</h2>
        <span>签到后会获取 150 token</span>
        <CheckIn />

        <br />
        <h2>占卜</h2>
        <span>读取 taro的价格然后 点击占卜进行扣除token</span>
        <BuyItem />
        
        <br />
        <span>交易成功后调用eliza的占卜 </span>
        <TarotReading />
        <br />


      
        <span>抽奖</span>
        {/* <Test /> */}

        <br />
        <h2>Swap token</h2>
        <span>读取token配置的价格，然后使用等值usd的sui来进行交换token</span>
        <UsdToSuiConverter />


        <br />
        <h2>抽奖</h2>
        <span>通过配置的奖池进行抽奖</span>
        <Lottery />

        <br />
        <h2>奖品</h2>
        <span>查看用户所抽到的奖品并且使用</span>
        <SetRaffleNft />

        <br />
        <h1>管理员功能</h1>
        <br />
        <h2>添加管理员</h2>
        <span>输入钱包地址进行管理员添加</span>

        <AddAdmin />
        <br />
        <h2>设置占卜价格(预设一个价格</h2>
        <span>已设置 item： taro ，price： 50 。要修改价格就填入 taro 和 要修改的 price即可</span>
        <SetItemsPrice />

        <br />
        <h2>设置购买token价格(预设一个价格</h2>
        <span>已设置 item： usd ，price： 150 。要修改价格就填入 usd 和 要修改的 price即可</span>
        <SetTokenPrice />


        <br />
        <h2>设置抽奖信息</h2>
        <CreateRaffle />


        <br />
        <h2>修改抽奖信息</h2>
        <span>抽nft加成每日领取的token数量,目前先固定2倍加成卡,3档 30天，7天，1天,概率 1% 5% 15%,抽奖一次100token，未中奖安慰奖返回50</span>
        <SetRaffle />
        
      </Container>
    </>
  );
}

export default App;
