import yaml from "js-yaml";
import fs from "fs";
import { exec, spawn } from "child_process";
import config from "./config.js";
const { updateTime } = config;
import { getProxyNodeList } from "./api/index.js";
// import template from "./template.yaml";
const template = fs.readFileSync("./src/template.conf", "utf-8");
let child;
let isLinux = false;
let timer = null

// 检测当前操作系统是否是Linux系统
if (process.platform === "linux") {
  console.log("当前是Linux系统");
  isLinux = true;
} else {
  isLinux = false
  console.log(`当前是其他系统：${process.platform}`);
}
main();
function main() {
  updateProxy()
}

async function updateProxy() {
  return getProxyNodeList().then((res) => {
    // console.log(res);
    let list = res.list;
    // let otherList = res.otherList;
    let yamlStr = template;

    list.forEach((item) => {
      let { server, password, uuid, sni } = item;
      const port = item.port || item.server_port;
      const type = item.type || item.security || "ss";
      if (type === "ss" || type === "hysteria2") {
        return;
      }
      yamlStr += `\nforward=${type}://${
        password || uuid
      }@${server}:${port}?allowInsecure=1&skipVerify=true`;
      if (sni) {
        yamlStr += `&peer=${sni}&sni=${sni}`;
      }
    });


    fs.writeFileSync("./glider/glider.conf", yamlStr);
    // 调用cmd命令,并在cmd窗口打印出结果，30秒后自动关闭cmd窗口
    const args = ["-config", "./glider/glider.conf"];
    const command =  `./glider/glider${(isLinux ? "" : ".exe")}`;
    child = spawn(command, args);

    // 监听输出
    child.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    return new Promise((resolve, reject) => {
      // 设置一个定时器，比如5秒后终止子进程
      timer = setTimeout(() => {
        child.kill(); // 发送中断信号
        console.log("kill glider");
        clearTimeout(timer);
        resolve();
      }, updateTime);
    });
  }).then(() => {
    clearTimeout(timer);
    console.log("start updateProxy ===");
    setTimeout(() => {
      updateProxy();
    }, 1000);
  });
}
