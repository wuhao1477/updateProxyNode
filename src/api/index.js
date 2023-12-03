import request from './request.js'
import config from '../config.js'
import {toJsonData} from '../utils/toJson.js'


export async function getProxyNodeList() {
    const list = config.nodeSubscribeList
    const promiseList = []
    list.forEach(item => {
        promiseList.push(request({
            url: item.url,
            method: 'get'
        }))
    })
    return Promise.all(promiseList).then(async (res) => {
        const resultList = []
        const otherList = []
        console.log(res)
        for(const item of res){
            if(typeof item == 'undefined') continue
            const {data} = item
            const {proxies} = await toJsonData(data)
            if(proxies){
                resultList.push(...proxies)
            }else{
                resultList.push(...data)
            }
        }
        return Promise.resolve({
            list:resultList,
            otherList
        })
    })
}

export default {
    getProxyNodeList
}
