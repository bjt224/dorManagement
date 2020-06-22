// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('student').add({
    data: {
      avatar: event.avatar,
      stuId: event.stuId,
      name: event.name,
      sex: event.sex,
      dorId: event.dorId,
      telephone: event.telephone,
      email: event.email,
      nation: event.nation
    }
  }).then(res => {
    console.log(res)
  })
}