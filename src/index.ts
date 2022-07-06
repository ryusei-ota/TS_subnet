

const ip2bin = (ip: string) => ip.split(".").map(e => Number(e).toString(2).padStart(8, '0')).join('')

const ip2long = (ip: string) => parseInt(ip2bin(ip), 2)

const long2ip = (num: number) => {
    let bin = Number(num).toString(2).padStart(32, '0')
    return [
        bin.slice(0, 8),
        bin.slice(8, 16),
        bin.slice(16, 24),
        bin.slice(24, 32),
    ].map(e => parseInt(e, 2)).join('.')
}

const cidr2long = (cidr: number) => parseInt(String("").padStart(cidr, '1').padEnd(32, '0'), 2)

const cidr2subnetmask = (num: number) => long2ip(cidr2long(Number(num)))

const subnetmask2cidr = (ip: string) => ip2bin(ip).split('1').length - 1

const getNetworkAddr = (ip: number, subnetmask: number) => (ip & subnetmask) >>> 0

const getBroadcastAddr = (ip: number, subnetmask: number) => (ip | ~subnetmask) >>> 0

const inRange = (remoteIp: number, acceptIp: number, cidr: number) => remoteIp >>> (32 - Number(cidr)) === acceptIp >>> (32 - Number(cidr))

const getClass = (ip: number) => {
    if (ip2long("0.0.0.0") <= ip && ip <= ip2long("127.255.255.255")) {
        return 'A'
    }
    if (ip2long("128.0.0.0") <= ip && ip <= ip2long("191.255.255.255")) {
        return 'B'
    }
    if (ip2long("192.0.0.0") <= ip && ip <= ip2long("223.255.255.255")) {
        return 'C'
    }
    if (ip2long("224.0.0.0") <= ip && ip <= ip2long("239.255.255.255")) {
        return 'D'
    }
    if (ip2long("240.0.0.0") <= ip && ip <= ip2long("255.255.255.255")) {
        return 'E'
    }
    return false;
}

// ネットワークアドレスがdb内にあると仮定
// 仮想ネットワークのアドレス空間
interface AddressListType {
    virtualNetwork: string;
    cidr: number;
    subnet?: Subnet[]
}
interface Subnet {
    address: string;
    cidr: number;
}

const networkAddressList: AddressListType[] =
    [
        {
            virtualNetwork: "10.4.0.0",
            cidr: 16,
            subnet: [
                {
                    address: "10.4.0.0",
                    cidr: 24
                },
                {
                    address: "10.4.1.0",
                    cidr: 24
                },
                {
                    address: "10.4.2.0",
                    cidr: 24
                }
            ]
        },
        {
            virtualNetwork: "10.5.0.0",
            cidr: 16,
            subnet: [
                {
                    address: "10.5.0.0",
                    cidr: 24
                }
            ]
        },
        {
            virtualNetwork: "10.6.0.0",
            cidr: 16,
            subnet: [
                {
                    address: "10.6.0.0",
                    cidr: 24
                }
            ]
        }
    ];










const virtualNetworkAddress = "10.4.0.0"
const subnetAddress = "10.4.2.0"
let virtualNetworkNum: number

virtualNetworkNum = virtualNetworkAdd(networkAddressList, virtualNetworkAddress)



if (virtualNetworkNum != 999999) {
    console.log(subnetAdd(networkAddressList, virtualNetworkNum, subnetAddress))
    console.log("アドレスが既に存在します")
} else {
    console.log("アドレスの作成が可能です")
}


/**
 * subnetのaddressが作成済かどうかの判定
 * @param array 
 * @param num 
 * @returns 
 */
function subnetAdd(array: AddressListType[], num: number, subnetAddress: string) {
    let flg = true
    for (let j = 0; j < array[num].subnet!.length; j++) {
        if (array[num].subnet![j].address.includes(subnetAddress)) {
            flg = false
        }
    }
    return flg
}

/**
 * virtualNetworkが存在するかしないかを判定後存在するところの配列番号を返す
 * @param array
 * @param address
 * @returns
 */
function virtualNetworkAdd(array: AddressListType[], address: string): number {
    let count = 999999
    for (let i = 0; i < array.length; i++) {
        if (array[i].virtualNetwork.includes(address)) {
            count = i
        }
    }
    return count
}







































/*

const ipLong = ip2long("192.168.0.1")
const cidr = cidr2long(28)
console.log(`
IPアドレス: ${long2ip(ipLong)}
サブネットマスク: /${subnetmask2cidr("255.255.255.0")} (${cidr2subnetmask(24)})
ネットワークアドレス: ${long2ip(getNetworkAddr(ipLong, cidr))}
使用可能IP: ${long2ip(getNetworkAddr(ipLong, cidr) + 1)} 〜 ${long2ip(getBroadcastAddr(ipLong, cidr) - 1)}
ブロードキャストアドレス: ${long2ip(getBroadcastAddr(ipLong, cidr))}
アドレス数: ${getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) + 1}
ホストアドレス数: ${getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) - 1}
IPアドレスクラス: ${getClass(ipLong)}
`)
console.log(`192.168.0.1 は 192.168.0.254/24 に含まれ${inRange(ip2long("192.168.0.1"), ip2long("192.168.1.254"), 24) ? 'ます' : 'ません'}`)
console.log(`192.168.1.0 は 192.168.0.254/24 に含まれ${inRange(ip2long("192.168.1.0"), ip2long("192.168.0.254"), 24) ? 'ます' : 'ません'}`)
*/