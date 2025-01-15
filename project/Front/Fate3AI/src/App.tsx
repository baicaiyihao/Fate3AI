import { ConnectButton } from "@mysten/dapp-kit";
import { Box } from "@radix-ui/themes";
import FunctionModule from "./UI/FunctionModule.tsx";
import "../src/css/index.css";
import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                height: "100vh",
                padding: "20px",
                boxSizing: "border-box"
            }}>
                {/* Top section with logo, check-in module, and connect button */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "20px"
                }}>
                    <Box>
                        <div className="div_img">
                            <img
                                src={
                                    "https://img.alicdn.com/imgextra/i1/O1CN01khO8o01EAwXZnPWhX_!!6000000000312-2-tps-144-144.png"
                                }
                                alt="Logo"
                                style={{ width: "50px", height: "50px" }} // 调整 Logo 大小
                            />
                        </div>
                    </Box>
                    <Box style={{ marginLeft: "0", marginRight: "auto" }}> {/* 居中对齐 */}
                        <FunctionModule
                            style={{
                                border: "solid",
                                borderRadius: "20px",
                                padding: "10px",
                                textAlign: "center"
                            }}
                            title={"签到"}
                            onclick={()=>{alert("签到成功")}}
                        />
                    </Box>
                    <Box className="box">
                        <ConnectButton className="connectButton" />
                    </Box>
                </div>

                {/* Bottom section with function modules */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "20px",
                    boxSizing: "border-box"
                }}>
                    <FunctionModule
                        style={{
                            flex: 1,
                            height: "600px",
                            border: "solid",
                            borderRadius: "20px",
                            margin: "0 5px",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        title={"塔罗牌占卜"}
                    />
                    <FunctionModule
                        style={{
                            flex: 1,
                            height: "600px",
                            border: "solid",
                            borderRadius: "20px",
                            margin: "0 5px",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        title={"每日签到"}
                    />
                    <FunctionModule
                        style={{
                            flex: 1,
                            height: "600px",
                            border: "solid",
                            borderRadius: "20px",
                            margin: "0 5px",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        title={"敬请期待..."}
                    />
                </div>
            </div>
        );
    }
}

export default App;