/* eslint-disable no-irregular-whitespace */
interface PeriodDurationsSec {
    [event: string]: number;
}

const periodDurationsSec: PeriodDurationsSec = {
    '1000d': 10000 * 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '1m': 60 * 1000,
};

export default periodDurationsSec;

/*.
 　＿＿
　<　　<＼
 （ ಠ　ಠ 　)_
　'三大三 ／　＼
-　 ）　　/　　 \
-／ ／^ i （ 　　 |二＼
(…(　（…/二＿／　）)
　)　　　　　　　)／
（_
' (　)
(_)_(_)
（o o)
==\o/==
*/
