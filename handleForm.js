document.addEventListener('DOMContentLoaded', function () {
    const TARGET_TIME = 480

    const subtractTime = (date2, date1)=>{
            return Math.floor((date2.getTime()-date1.getTime())/60000)
    }

    const normalizeTime = (timeString)=>{
        let date = new Date()
        let AM_PM = timeString.slice(-2)
        timeString = (timeString.slice(0, 1)==='0') ? timeString.slice(1,-2): timeString.slice(0,-2)
        let [hour, min]= timeString.split(':')
        hour = (AM_PM.toLowerCase() === "am") ? timeMapAM.get(hour): timeMapPM.get(hour)
        min = parseInt(min)
        if(hour == 9 && min <= 5){
            min = 0;
        }
        if(hour == 8 && min >= 55){
            hour = 9
            min = 0
        }
        date.setHours(hour)
        date.setMinutes(min)
        date.setSeconds(0)
        return date;
    }

    const testFormat = (str1, str2, str3) =>{
        const zeroRegex = /^[0]{1,2}:[0]{1,2}\s*[APap][Mm]$/
        const regex = /^[0-9]{1,2}:[0-5][0-9]\s*[APap][Mm]$/;
        try{
            if(zeroRegex.test(str1) || zeroRegex.test(str2) || zeroRefex.test(str3) || !regex.test(str1) || !regex.test(str2) || !regex.test(str3)){
                alert("TIME FORMAT SHOULD BE 'h:mm' ENDING IN 'AM/am' or 'PM/pm'")
                throw new Error()
            }
        }catch(error){
            throw new Error("incorrect format")
        }
    }

    const timeMapAM = new Map([
        ['12', 24],
        ['1', 1],
        ['2', 2],
        ['3', 3],
        ['4', 4],
        ['5', 5],
        ['6', 6],
        ['7', 7],
        ['8', 8],
        ['9', 9],
        ['10', 10],
        ['11', 11]
    ])
    const timeMapPM = new Map([
        ['12', 12],
        ['1', 13],
        ['2', 14],
        ['3', 15],
        ['4', 16],
        ['5', 17],
        ['6', 18],
        ['7', 19],
        ['8', 20],
        ['9', 21],
        ['10', 22],
        ['11', 23]
    ])

    let timeForm = document.getElementById("timeForm")
    timeForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        let shiftStartElement = document.getElementById('shift-in')
        let lunchStartElement = document.getElementById('lunch-out')
        let lunchEndElement = document.getElementById('lunch-in')
        testFormat(shiftStartElement.value, lunchStartElement.value, lunchEndElement.value)
        let shiftStartValue = normalizeTime(shiftStartElement.value)
        let lunchStartValue = normalizeTime(lunchStartElement.value)
        let lunchEndValue = normalizeTime(lunchEndElement.value)
        let timeBlock1 = subtractTime(lunchStartValue, shiftStartValue)
        let lunchDuration = subtractTime(lunchEndValue, lunchStartValue)
        if(lunchDuration<31){
            let timeBoxText = document.getElementById("timeBox")
            timeBoxText.textContent = ""
            console.warn("LUNCH MUST BE AT LEAST 31 MINUTES")
            alert("LUNCH MUST BE AT LEAST 31 MINUTES")
            return
        }
        let remainingTime = TARGET_TIME - timeBlock1
        let outTime = new Date(lunchEndValue.getTime() + remainingTime * 60000)
        let timeString = outTime.toLocaleTimeString(undefined, {hour: 'numeric', minute:'2-digit'})
        document.getElementById("timeBox").innerHTML = timeString
    })
    timeForm.addEventListener("reset", (e)=>{
        let timeBoxText = document.getElementById("timeBox")
        timeBoxText.textContent = ""
    }) 
})
