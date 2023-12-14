// 导入 Node.js 的内置模块对base64进行解码
import base64 from 'base-64'
const { encode } = base64
// 导入 js-yaml
import yaml from 'js-yaml'

/**
 * 将给定的字符串转换为 JSON 对象,传入的字符串可能是 Base64 编码的字符串，也可能是 YAML 格式的字符串，也可能是 JSON 格式的字符串，所以需要先判断字符串的格式
 * @param {string} str - 要转换的字符串
 * @return {object} JSON 对象
 */
export function toJsonData(str) {
    // 检查字符串是否为空
    if (!str) {
        return Promise.reject('字符串不能为空')
    }
    // 检查字符串是否已经是数组
    if(Array.isArray(str)||typeof str === 'object'){
        return Promise.resolve(str)
    }
    const isValidBase64 = checkValidBase64(str)
    if (isValidBase64) {
        // 如果字符串是有效的 Base64 编码，则先对字符串进行解码
        // str = encode(str)
        return Promise.reject('暂不支持 Base64 编码的订阅链接')
    }

    try {
        // console.log("str",str)
        // 将字符串转换为 JSON 对象
        const jsonObj = yaml.load(str)
        return Promise.resolve(jsonObj)
      } catch (e) {
        console.error("解析错误:", e.message);  // 输出具体的错误信息
        return Promise.resolve({})
      }
}

/**
 * 检查给定的字符串是否为有效的 Base64 编码
 * @param {string} str - 要检查的字符串
 * @return {boolean} 如果字符串是有效的 Base64 编码，则为 true；否则为 false
 */
export function checkValidBase64(str) {
    // 检查字符串是否为空
    if (!str) {
        return false;
    }

    // 正则表达式用于匹配 Base64 编码的模式
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

    // 使用正则表达式测试字符串
    return base64Pattern.test(str);
}


export default {
}