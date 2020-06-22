// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('charge').add({
    data: {
      airConditioner: event.airConditioner,
      ammeter: event.ammeter,
      date: event.date,
      dorId: event.dorId,
      hotWater: event.hotWater,
      waterMeter: event.waterMeter,
      images: event.images,
      eleRate: event.eleRate,
      waterRate: event.waterRate,
      totalPrice: event.totalPrice,
      isPay: event.isPay
    }
  })
}