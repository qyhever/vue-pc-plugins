// // 随机生成五十个英文名，要求二十六个字母都有出现
// const randomEnglishName = () => {
//   const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica', 'William', 'Ashley']
//   const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor']
//   const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
//   const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
//   return `${randomFirstName} ${randomLastName}`
// }

// // 五十个 userId，每个 userId 都是随机的 8 位数字
// const randomUserId = () => {
//   return Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
// }

// const names = Array.from({ length: 50 }, randomEnglishName)
// console.log(JSON.stringify(names, null, 2))
// const userIds = Array.from({ length: 50 }, randomUserId)
// console.log(JSON.stringify(userIds, null, 2))
const names = [
  'David Miller',
  'Jessica Johnson',
  'Sarah Davis',
  'William Davis',
  'Robert Wilson',
  'Sarah Davis',
  'Michael Brown',
  'William Brown',
  'Robert Johnson',
  'Michael Wilson',
  'William Smith',
  'Ashley Miller',
  'Robert Williams',
  'John Taylor',
  'David Davis',
  'Jessica Davis',
  'Jessica Wilson',
  'Robert Davis',
  'Jane Moore',
  'Michael Smith',
  'Jane Moore',
  'John Brown',
  'Emily Williams',
  'Michael Davis',
  'Michael Williams',
  'William Johnson',
  'Sarah Williams',
  'John Smith',
  'William Johnson',
  'Michael Miller',
  'Jane Williams',
  'Ashley Williams',
  'Jessica Wilson',
  'Jessica Jones',
  'Jessica Smith',
  'David Miller',
  'Robert Taylor',
  'Michael Taylor',
  'Emily Miller',
  'Jane Williams',
  'Ashley Johnson',
  'Robert Miller',
  'Sarah Moore',
  'Robert Jones',
  'Michael Jones',
  'David Moore',
  'Emily Moore',
  'Robert Wilson',
  'Jessica Taylor',
  'Jane Brown'
]

const userIds = [
  '23358540',
  '62616239',
  '15453478',
  '63983048',
  '93072753',
  '50446662',
  '22721556',
  '62658573',
  '69119419',
  '74667068',
  '07863797',
  '11930378',
  '48861735',
  '22453371',
  '56666133',
  '06644686',
  '05949253',
  '37679248',
  '29774953',
  '28637258',
  '92614625',
  '96602956',
  '68025263',
  '09144250',
  '90319172',
  '02409410',
  '03226979',
  '15408494',
  '54602368',
  '96646122',
  '92649812',
  '95998799',
  '19038989',
  '47231706',
  '24458187',
  '06348518',
  '20540655',
  '35771161',
  '42103708',
  '59489460',
  '16223583',
  '60889508',
  '97829881',
  '52837060',
  '37027384',
  '20709966',
  '90879029',
  '07895312',
  '72511127',
  '41752025'
]

// 每个 userId 对应一个 name
const staffList = userIds.map((userId, index) => ({
  userId,
  name: names[index]
}))

export function getStaffListByKeyword (keyword) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(staffList.filter(staff => staff.name.includes(keyword)).slice(0, 10))
    }, 500)
  })
}
