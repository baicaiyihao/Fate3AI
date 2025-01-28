import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import CreateProfile from "./components/createProfile";
import CheckIn from "./components/checkIn";
import Getuserinfo from "./components/getUserProfile";
import AddAdmin from "./components/addAdmin";
import SetItemsPrice from "./components/setItemPrice";
import BuyItem from "./components/buyItems";

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
        <span>创建用户</span>
        <span>输入一个用户名之类的创建</span>
        <CreateProfile />
        <br />
        <span>签到</span>
        <span>签到后会获取 150 token</span>
        <CheckIn />

        <br />

        <span>占卜</span>
        <span>读取 taro的价格然后 点击占卜进行扣除token</span>
        <BuyItem  />

        <br />
        <span>用户信息</span>
        <Getuserinfo /> 

        <br />
        <h1>管理员功能</h1>
        <br />
        <span>添加管理员</span>
        <span>输入钱包地址进行管理员添加</span>

        <AddAdmin />
        <br />
        <span>设置占卜价格(预设一个价格</span>
        <span>已设置 item： taro ，price： 50 。要修改价格就填入 taro 和 要修改的 price即可</span>
        <SetItemsPrice />
        
      </Container>
    </>
  );
}

export default App;
