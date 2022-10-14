
/**
* 使用此文件来定义自定义函数和图形块。
* 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom

这是七星虫的拓展模块，为了方便小年龄的学生使用，将复杂的模块进行封装
*/



enum LightStatus{
    //% block="灭"
    Off,
     //% block="亮"
    On
}
enum YaoGanStatus {
    //% block="左"
    Left,
    //% block="右"
    Right,
    //% block="上"
    Up,
    //% block="下"
    Down,
    //% block="按压"
    Press,
    //% block="未按压"
    Release
}
enum MotorDirection {
    //% block="逆时针"
    Zero,
    //% block="顺时针"
    One
}
enum Motors {
    //% block="M1"
    M1,
    //% block="M2"
    M2
}
enum DHT_DATA_TYPE {
    //% block='湿度 humidity'
    humidity=dataType.humidity,
    //% block='温度 temperature'
    temperature = dataType.temperature,
}

/**
 * 七星虫套装可使用的的模块
 */
//% weight=100 color=#0fbc11 icon="\uf005" block="自定义积木-七星虫"
//% groups=['灯', '大电机', '摇杆','温湿度传感器']
namespace qiXingChong {
    
    export class YaoGan {
        xp:AnalogPin
        yp:AnalogPin
        ap:AnalogPin
        // 构造函数 
        constructor(xp: AnalogPin,
        yp: AnalogPin,
        ap: AnalogPin) {
            this.xp = xp
            this.yp = yp
            this.ap = ap
        }
    }

    function mk_motor_run_privete(motor: Motors, power: number, direction: MotorDirection){
        let powerP
        let direP
        if (motor == Motors.M1) {
            powerP = AnalogPin.P16
            direP = DigitalPin.P2
        } else {
            powerP = AnalogPin.P12
            direP = DigitalPin.P8
        }
        if (power < 0) {
            direction = Math.abs(direction - 1)
            power = Math.abs(power)
        }
        pins.analogWritePin(powerP, power)
        pins.digitalWritePin(direP, direction)
    }
    
    /**
     * 电机转动，且没有时间限制，功率正负值分别代表不同的转动方向，功率0则会电机停止
     */
    //% block="电机$motor转动,功率:$power"
    //% power.min=-1022 power.max=1022 power.defl=1022
    //% inlineInputMode=inline
    //% group='大电机'
    export function mk_motor_run(motor:Motors, power: number):void{
        let direction=0
        mk_motor_run_privete(motor, power, direction)
    }

    /**
     * 控制电机停止
     */
    //% block="电机%motor停止"
    //% group='大电机'
    export function mk_motor_stop(motor: Motors): void {
        let powerP
        if (motor == Motors.M1) {
            powerP = AnalogPin.P16
        } else {
            powerP = AnalogPin.P12
        }
        pins.analogWritePin(powerP, 0)
    }

    /**
     * 指定时间内电机转动，功率正负值分别代表不同的转动方向，功率0则会电机停止
     */
    //% block="电机%motor转动%time毫秒,功率:%power"
    //% power.min=-1022 power.max=1022 power.defl=1022 time.min=0 time.defl=1000 time.shadow=timePicker
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% group='大电机'
    export function mk_motor_run_with_time(motor: Motors, time: number, power: number){
        mk_motor_run(motor, power)
        basic.pause(time)
        mk_motor_stop(motor)
    }

    /**
     * 指定时间内，两个电机同时转动同时停止，功率正负值分别代表不同的转动方向，功率0则会电机停止
     */
    //% block="双电机转动|%time毫秒,M1功率:%power1,M2功率:%power2"
    //% power1.min=-1022 power1.max=1022 power1.defl=1022 power2.min=-1022 power2.max=1022 power2.defl=1022 time.shadow=timePicker
    //% inlineInputMode=inline
    //% group='大电机'
    export function mk_tow_motor_run_with_time(time: number,
     power1: number,
     power2: number){
        mk_motor_run(Motors.M1, power1)
        mk_motor_run(Motors.M2, power2)
        basic.pause(time)
        mk_motor_stop(Motors.M1)
        mk_motor_stop(Motors.M2)
    }


    /**
     * 摇杆引脚初始配置模块，返回一个能获取摇杆状态的对象
     * @param xp 是X坐标对应的引脚
     * @param yp 是Y坐标对应的引脚
     * @param ap 是向下按的坐标对应的引脚
     */
    //% weight=200
    //% block="创建摇杆对象,x坐标引脚:%xp,y坐标引脚:%yp,按钮引脚:%ap"
    //% blockSetVariable=摇杆1
    //% xp.defl=AnalogPin.P0 yp.defl=AnalogPin.P1 ap.defl=AnalogPin.P2
    //% group='摇杆'
    export function yaoGanInit(xp: AnalogPin, yp: AnalogPin, ap: AnalogPin):YaoGan{
        let yaogan = new YaoGan(xp,yp,ap)
        return yaogan
    }

    /**
     * 获取摇杆x方向上的值
     */
    //% block="读取 $yaogan=variables_get(摇杆1) 的X值"
    //% group='摇杆'
    export function yaoGan_x(yaogan: YaoGan): number{
        return pins.analogReadPin(yaogan.xp)
    }

    /**
     * 获取摇杆y方向上的值
     */
    //% block="读取 $yaogan=variables_get(摇杆1) 的Y值"
    //% group='摇杆'
    export function yaoGan_y(yaogan: YaoGan): number {
        return pins.analogReadPin(yaogan.yp)
    }
    /**
     * 获取摇杆按钮的值
    */
    //% block="读取 $yaogan=variables_get(摇杆1) 按钮的值"
    //% group='摇杆'
    export function yaoGan_a(yaogan: YaoGan): number {
        return pins.analogReadPin(yaogan.ap)
    }

    /**
    * 侦测摇杆的状态
    */
    //% block="侦测 %yaogan=variables_get(摇杆1) %status"
    //% group='摇杆'
    export function yaoGan_status(yaogan: YaoGan, status:YaoGanStatus): boolean {
        if (status == YaoGanStatus.Left && yaoGan_x(yaogan) <= 10){
            return true
        }
        if (status == YaoGanStatus.Right && yaoGan_x(yaogan) >= 1000){
            return true
        }
        if (status == YaoGanStatus.Up && yaoGan_y(yaogan) >= 1000){
            return true
        }
        if (status == YaoGanStatus.Down && yaoGan_y(yaogan) <= 10){
            return true
        }
        if (status == YaoGanStatus.Press && yaoGan_a(yaogan) <= 10){
            return true
        }
        if (status == YaoGanStatus.Release && yaoGan_a(yaogan) >= 800){
            return true
        }
        return false
    }

    /**
    * 开关灯
    */
    //% block="引脚%p的灯设置为%status"
    //% group='灯'
    export function setLightStatus(p:DigitalPin,status:LightStatus){
        pins.digitalWritePin(p, status)
    }
    
    /**
    * 设置灯的亮度
    */
    //% block="引脚%p的灯的亮度为%luminance"
    //% luminance.min=0 luminance.max=1023
    //% group='灯'
    export function setLightLuminance(p: AnalogPin, luminance: number) {
        pins.analogWritePin(p, luminance)
    }

    /**
    * 将温湿度传感器初始化
    */
    //% weight=200
    //% block="初始化温湿度传感器,引脚为%p"
    //% group='温湿度传感器'
    export function dht11_init(p: DigitalPin) {
        dht11_dht22.queryData(
            DHTtype.DHT11,
            p,
            true,
            false,
            true
        )
    }

    /**
     * 读取数据温湿度
     */
    //% block="读取 %t"
    //% t.loc.fr="le nombre"
    //% group='温湿度传感器'
    export function dht11_readData(t: DHT_DATA_TYPE):number{
        return dht11_dht22.readData(t==0?dataType.humidity:dataType.temperature)
    }
}
