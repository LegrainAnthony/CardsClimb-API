
const moment = require('moment')
moment.locale('fr')


const CalculateRevisionTime = (days) => {
    console.log(moment().add(days, 'days').format('X'));
    // console.log(moment().add(days, 'days').startOf('day').format("llll"));
    // console.log(moment().add(days, 'days').endOf('day').add(1, 'minutes').format("llll"));

}

CalculateRevisionTime(3)
// .add(days, 'days')