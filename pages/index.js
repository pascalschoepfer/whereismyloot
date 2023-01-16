import useSWR from 'swr';
import {useEffect, useState} from "react";
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import TextInput from "../components/textInput";
import Select from "../components/select";
import Checkbox from "../components/checkbox";
import Head from 'next/head';

const fetcher = (url) => fetch(url).then((res) => res.json());

const constants = Object.freeze({
    BANANA_PER_RUN: 0.4,
    KONGIUM_PER_LEVEL: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5],
    CHARMZ_DOUBLEKONGIUM_CHANCE: [1, 1.2, 1.4, 2],
    CHARMZ_NAMES: ["None", "Cyber Fragment", "Rainbow Crystal", "Promethean Relic"]
})

const Home = () => {
    const [bananaPrice, setBananaPrice] = useState(0)
    const [charmzPrices, setCharmzPrices] = useState([0,0.0045, 0.03, 0.5])
    const [embCommPrice, setEmbCommPrice] = useState(0.002)
    const [embRarePrice, setEmbRarePrice] = useState(0.03)
    const [embEpicPrice, setEmbEpicPrice] = useState(0.15)
    const [embLegePrice, setEmbLegePrice] = useState(1)
    const [wlVouchPrice, setWlVouchPrice] = useState(0.02)
    const [shredzPrice, setShredzPrice] = useState(0.06)
    const [goldenTicketPrice, setGoldenTicketPrice] = useState(0.7)
    const [kongiumPricePerBanana, setKongiumPricePerBanana] = useState(65)
    const [results, setResults] = useState([])

    const {data: eData, error: eError} = useSWR('/api/eventdata', fetcher);
    const {
        data: bananaData,
        error: bananaError
    } = useSWR('https://api.coingecko.com/api/v3/simple/price?ids=banana&vs_currencies=eth', fetcher);

    useEffect(() => {
        if (bananaData) {
            setBananaPrice(bananaData.banana.eth)
        }
    }, [bananaData])

    useEffect(() => {
        window.onclick = function(event) {
            if (event.target === document.getElementById("prices")) {
                document.getElementById("prices").style.display = "none";
            }
        }
    })

    if (eError || bananaError) return <div>Failed to load</div>;

    if (bananaPrice && eData) {
        let eventData = JSON.parse(eData);

        return <div className="container-xxl container-fluid mt-3">
            <Head>
                <title>Where is my loot?</title>
            </Head>
            <div className="justify-content-between">
                <div className="row">
                    <div className="mb-3">
                        <h3>Configuration</h3>
                        <Formik
                            initialValues={{
                                fuelRodRun: false,
                                charmz: 0,
                                teamSize: 1,
                                vxLevel1: 1,
                                vxLevel2: 1,
                                vxLevel3: 1,
                                vxLevel4: 1,
                                vxLevel5: 1,
                                teamLevel: 1,
                                highestLevelKong: 1,
                                runCount: 1,
                            }}
                            validationSchema={Yup.object({
                                fuelRodRun: Yup.boolean(),
                                charmz: Yup.number(),
                                teamSize: Yup.number(),
                                vxLevel1: Yup.number(),
                                vxLevel2: Yup.number(),
                                vxLevel3: Yup.number(),
                                vxLevel4: Yup.number(),
                                vxLevel5: Yup.number(),
                                teamLevel: Yup.number(),
                                highestLevelKong: Yup.number(),
                                runCount: Yup.number(),
                            })}
                            onSubmit={(values, {setSubmitting}) => {
                                setTimeout(() => {
                                    let resultsFromCalc = {
                                        "KongiumNormalGains": 0,
                                        "KongiumBonusEvents": 0,
                                        "KongiumCombined": 0,
                                        "Exp": 0,
                                        "Cyber": 0,
                                        "Rainbow": 0,
                                        "Promethean": 0,
                                        "EmbComm": 0,
                                        "EmbRare": 0,
                                        "EmbEpic": 0,
                                        "EmbLege": 0,
                                        "WhitelistV": 0,
                                        "OneShredz": 0,
                                        "TwoShredz": 0,
                                        "FourShredz": 0,
                                        "GoldenTicket": 0,
                                    }

                                    //suboptimal section, needs to be improved. maybe with array for all levels instead
                                    //of values/selects for each
                                    values.teamSize = Number(values.teamSize);
                                    values.teamLevel = Number(values.vxLevel1);
                                    values.highestLevelKong = Number(values.vxLevel1);
                                    let kongiumGains = constants.KONGIUM_PER_LEVEL[Number(values.vxLevel1)-1];

                                    if (values.teamSize > 1) {
                                        values.teamLevel += Number(values.vxLevel2);
                                        if (Number(values.vxLevel2) > values.highestLevelKong) {
                                            values.highestLevelKong = Number(values.vxLevel2);
                                        }
                                        kongiumGains += constants.KONGIUM_PER_LEVEL[Number(values.vxLevel2)-1];
                                    }
                                    if (values.teamSize > 2) {
                                        values.teamLevel += Number(values.vxLevel3);
                                        if (Number(values.vxLevel3) > values.highestLevelKong) {
                                            values.highestLevelKong = Number(values.vxLevel3);
                                        }
                                        kongiumGains += constants.KONGIUM_PER_LEVEL[Number(values.vxLevel3)-1];
                                    }
                                    if (values.teamSize > 3) {
                                        values.teamLevel += Number(values.vxLevel4);
                                        if (Number(values.vxLevel4) > values.highestLevelKong) {
                                            values.highestLevelKong = Number(values.vxLevel4);
                                        }
                                        kongiumGains += constants.KONGIUM_PER_LEVEL[Number(values.vxLevel4)-1];

                                    }
                                    if (values.teamSize > 4) {
                                        values.teamLevel += Number(values.vxLevel5);
                                        if (Number(values.vxLevel5) > values.highestLevelKong) {
                                            values.highestLevelKong = Number(values.vxLevel5);
                                        }
                                        kongiumGains += constants.KONGIUM_PER_LEVEL[Number(values.vxLevel5)-1];
                                    }
                                    resultsFromCalc.KongiumNormalGains =
                                        kongiumGains * constants.CHARMZ_DOUBLEKONGIUM_CHANCE[Number(values.charmz)];

                                    eventData
                                        .filter(e => values.fuelRodRun || e.eventType !== "Rod")
                                        .filter(e => Number(values.charmz) >= e.charmReq)
                                        .filter(e => Number(values.teamSize) >= e.teamSizeReq)
                                        .filter(e => Number(values.teamLevel) >= e.teamLvlReq)
                                        .filter(e => Number(values.highestLevelKong) >= e.lvlReq)
                                        .forEach(e => {
                                            switch (e.rewardType) {
                                                case "Kongium":
                                                    resultsFromCalc.KongiumBonusEvents += e.chance * e.rewardAmount;
                                                    break;
                                                case "Exp":
                                                    resultsFromCalc.Exp += e.chance * e.rewardAmount;
                                                    break;
                                                case "Cyber":
                                                    resultsFromCalc.Cyber += e.chance * e.rewardAmount;
                                                    break;
                                                case "Rainbow":
                                                    resultsFromCalc.Rainbow += e.chance * e.rewardAmount;
                                                    break;
                                                case "Promethean":
                                                    resultsFromCalc.Promethean += e.chance * e.rewardAmount;
                                                    break;
                                                case "EmbComm":
                                                    resultsFromCalc.EmbComm += e.chance * e.rewardAmount;
                                                    break;
                                                case "EmbRare":
                                                    resultsFromCalc.EmbRare += e.chance * e.rewardAmount;
                                                    break;
                                                case "EmbEpic":
                                                    resultsFromCalc.EmbEpic += e.chance * e.rewardAmount;
                                                    break;
                                                case "EmbLege":
                                                    resultsFromCalc.EmbLege += e.chance * e.rewardAmount;
                                                    break;
                                                case "WhitelistV":
                                                    resultsFromCalc.WhitelistV += e.chance * e.rewardAmount;
                                                    break;
                                                case "Shredz":
                                                    switch (e.rewardAmount) {
                                                        case 1:
                                                            resultsFromCalc.OneShredz += e.chance;
                                                            break;
                                                        case 2:
                                                            resultsFromCalc.TwoShredz += e.chance;
                                                            break;
                                                        case 4:
                                                            resultsFromCalc.FourShredz += e.chance;
                                                            break;
                                                    }
                                                    break;
                                                case "GoldenTicket":
                                                    resultsFromCalc.GoldenTicket += e.chance * e.rewardAmount;
                                                    break;
                                            }
                                        })
                                    resultsFromCalc.KongiumBonusEvents = resultsFromCalc.KongiumBonusEvents/100;
                                    resultsFromCalc.KongiumCombined = resultsFromCalc.KongiumBonusEvents + resultsFromCalc.KongiumNormalGains;
                                    resultsFromCalc.inputs = values;
                                    setResults(resultsFromCalc)
                                    console.log(resultsFromCalc)
                                    setSubmitting(false);
                                }, 100);
                            }}
                        >
                            {props => (

                                <Form>
                                <Checkbox label="Fuel Rod Run" name="fuelRodRun">
                                    Using fuel rods for runs.
                                </Checkbox>

                                <Select label="Charmz" name="charmz">
                                    <option value={0}>{constants.CHARMZ_NAMES[0]}</option>
                                    <option value={1}>{constants.CHARMZ_NAMES[1]}</option>
                                    <option value={2}>{constants.CHARMZ_NAMES[2]}</option>
                                    <option value={3}>{constants.CHARMZ_NAMES[3]}</option>
                                </Select>

                                <Select label="Team Size" name="teamSize">
                                    {[...Array(5)].map((x, i) =>
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    )}
                                </Select>

                                <h5>Levels:</h5>
                                <div id="container-levels" className="container col-7 row justify-content-start">
                                        {[...Array(5)].map((x, i) =>
                                            <div className="col-3 col-md-2 p-0"  key={i + 1}>
                                                {props.values.teamSize > i ?
                                                    <Select label={`VX#` + (i+1)} name={`vxLevel` + (i+1)}>
                                                        {[...Array(20)].map((y, j) =>
                                                            <option key={j + 1} value={j + 1}>{j + 1}</option>
                                                        )}
                                                    </Select>
                                                    : <div></div>}
                                            </div>
                                        )}
                                </div>

                                <TextInput
                                    label="Run count"
                                    name="runCount">
                                </TextInput>
                                    <br/>

                                <button type="submit" className="btn btn-secondary">Calculate</button>
                                <button className="btn btn-secondary" onClick={togglePrices}>Change prices</button>
                            </Form>)}
                        </Formik>
                    </div>
                    <div className="col-md-4">
                        <div id="prices" className="custom-modal">
                            <div className="custom-modal-content">
                                <Formik
                                    initialValues={{
                                        nanaPrice: bananaPrice,
                                    }}
                                    validationSchema={Yup.object({
                                        nanaPrice: Yup.number().typeError('Banana price must be a number like 0.001 -> default price from Coingecko should be ok in most cases.'),
                                    })}
                                    onSubmit={(values, {setSubmitting}) => {
                                        setTimeout(() => {
                                            setBananaPrice(Number(values.nanaPrice))
                                            setSubmitting(false);
                                        }, 100);
                                    }}
                                >
                                    <Form>
                                        <TextInput
                                            label="Banana price (from Coingecko in ETH)"
                                            name="nanaPrice"
                                            type="text"
                                        />
                                        <br/>
                                        <button type="submit" onClick={togglePrices} className="btn btn-secondary">Set own Banana price</button>
                                        <button className="btn" onClick={togglePrices}>Cancel</button>
                                    </Form>
                                </Formik>
                                <br/>

                                <Formik
                                    initialValues={{
                                        cyberPriceVal: charmzPrices[1],
                                        rainbowPriceVal: charmzPrices[2],
                                        promPriceVal: charmzPrices[3],
                                        embCommPriceVal: embCommPrice,
                                        embRarePriceVal: embRarePrice,
                                        embEpicPriceVal: embEpicPrice,
                                        embLegePriceVal: embLegePrice,
                                        wlVouchPriceVal: wlVouchPrice,
                                        shredzPriceVal: shredzPrice,
                                        goldenTicketPriceVal: goldenTicketPrice,
                                        kongiumPricePerBananaVal: kongiumPricePerBanana
                                    }}
                                    validationSchema={Yup.object({
                                        cyberPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        rainbowPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        promPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        embCommPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        embRarePriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        embEpicPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        embLegePriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        wlVouchPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        shredzPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        goldenTicketPriceVal: Yup.number().typeError('Price must be a number, priced in $ETH.'),
                                        kongiumPricePerBananaVal: Yup.number().typeError('Price must be a number, as in Kongium per Banana'),
                                    })}
                                    onSubmit={(values, {setSubmitting}) => {
                                        setTimeout(() => {
                                            setCharmzPrices([0, Number(values.cyberPriceVal), Number(values.rainbowPriceVal),Number(values.promPriceVal)])
                                            setEmbCommPrice(Number(values.embCommPriceVal))
                                            setEmbRarePrice(Number(values.embRarePriceVal))
                                            setEmbEpicPrice(Number(values.embEpicPriceVal))
                                            setEmbLegePrice(Number(values.embLegePriceVal))
                                            setWlVouchPrice(Number(values.wlVouchPriceVal))
                                            setShredzPrice(Number(values.shredzPriceVal))
                                            setGoldenTicketPrice(Number(values.goldenTicketPriceVal))
                                            setKongiumPricePerBanana(Number(values.kongiumPricePerBananaVal))
                                            setSubmitting(false);
                                        }, 100);
                                    }}
                                >
                                    <Form>
                                        <h4>Price of loot</h4>
                                        <TextInput
                                            label="Cyber Fragments"
                                            name="cyberPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Rainbow Crystal"
                                            name="rainbowPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Promethean Relic"
                                            name="promPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Embattle Capsule Common"
                                            name="embCommPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Embattle Capsule Rare"
                                            name="embRarePriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Embattle Capsule Epic"
                                            name="embEpicPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Embattle Capsule Legendary"
                                            name="embLegePriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Shredz"
                                            name="shredzPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Golden Ticket"
                                            name="goldenTicketPriceVal"
                                            type="text"
                                        /><br/>
                                        <TextInput
                                            label="Kongium per banana"
                                            name="kongiumPricePerBananaVal"
                                            type="text"
                                        />
                                        <br/>
                                        <button type="submit" onClick={togglePrices} className="btn btn-secondary">Set own loot prices</button>
                                        <button className="btn" onClick={togglePrices}>Cancel</button>

                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="my-2">
                        {Object.keys(results).length !== 0 &&
                            <div id="results" className="row">
                                <div className="col-12 col-md-4">
                                    <h3>Rewards</h3>
                                    <hr/>
                                    <div><b>Embattle Common: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.EmbComm/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Embattle Rare: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.EmbRare/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Embattle Epic: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.EmbEpic/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Embattle Legendary: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.EmbLege/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Cyber Fragment: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.Cyber/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Rainbow Crystal: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.Rainbow/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Promethean Relic: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.Promethean/100,results.inputs.runCount))),3)}%</div>
                                    <div><b>Shredz: </b>
                                        1x: {roundNumberToMaxDigits((100*(1-Math.pow(1-results.OneShredz/100,results.inputs.runCount))),3)}%
                                        2x: {roundNumberToMaxDigits((100*(1-Math.pow(1-results.TwoShredz/100,results.inputs.runCount))),3)}%
                                        4x: {roundNumberToMaxDigits((100*(1-Math.pow(1-results.FourShredz/100,results.inputs.runCount))),3)}%
                                    </div>
                                    <div><b>Golden Ticket: </b>{roundNumberToMaxDigits((100*(1-Math.pow(1-results.GoldenTicket/100,results.inputs.runCount))),2)}%</div>
                                    <div>
                                        <b>Kongium: </b>
                                        {`
                                            ${roundNumberToMaxDigits((results.inputs.runCount*results.KongiumCombined),2)} 
                                            (${roundNumberToMaxDigits((results.inputs.runCount*results.KongiumBonusEvents),2)} from events)                                            
                                        `}
                                    </div>
                                    <hr/>
                                </div>
                                <div className="col-12 col-md-4">
                                    <h3>Costs</h3>
                                    <hr/>
                                    <div>
                                        {
                                            (results.inputs.fuelRodRun === true) ?
                                                <div><b>Fuel rods: </b>{results.inputs.runCount*results.inputs.teamSize}</div> :
                                                <div>
                                                    <b>Bananas: </b>
                                                    {`${roundNumberToMaxDigits(results.inputs.runCount*constants.BANANA_PER_RUN*results.inputs.teamSize, 1)} 
                                                    (${roundNumberToMaxDigits(results.inputs.runCount*constants.BANANA_PER_RUN*results.inputs.teamSize*bananaPrice, 4)} ETH)`}
                                                </div>
                                        }
                                    </div>
                                    <div>
                                        {
                                            (results.inputs.charmz > 0) ?
                                                <div>
                                                    <b>Charmz: </b>
                                                    {`${calcCharmzNeedd(results.inputs.runCount)} ${constants.CHARMZ_NAMES[results.inputs.charmz]} 
                                                    (${roundNumberToMaxDigits(calcCharmzNeedd(results.inputs.runCount)*charmzPrices[results.inputs.charmz], 4)} ETH)`}
                                                </div>
                                                : ``
                                        }
                                    </div>
                                    <div>
                                        {
                                            (results.inputs.charmz > 0 && results.inputs.fuelRodRun === false) ?
                                                <div>
                                                    <b>Combined: </b>
                                                    {roundNumberToMaxDigits((results.inputs.runCount*constants.BANANA_PER_RUN*results.inputs.teamSize*bananaPrice
                                                        +calcCharmzNeedd(results.inputs.runCount)*charmzPrices[results.inputs.charmz]),4)} ETH
                                                    </div> : ``
                                        }
                                    </div>
                                    <hr/>
                                </div>
                                <div className="col-12 col-md-4">
                                    <h3>Expected value</h3>
                                    <hr/>
                                    <div><b>Embattle Common: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.EmbComm/100*embCommPrice, 6)} ETH`}</div>
                                    <div><b>Embattle Rare: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.EmbRare/100*embRarePrice, 6)} ETH`}</div>
                                    <div><b>Embattle Epic: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.EmbEpic/100*embEpicPrice, 6)} ETH`}</div>
                                    <div><b>Embattle Legendary: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.EmbLege/100*embLegePrice, 6)} ETH`}</div>
                                    <div><b>Cyber Fragment: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.Cyber/100*charmzPrices[1], 6)} ETH`}</div>
                                    <div><b>Rainbow Crystal: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.Rainbow/100*charmzPrices[2], 6)} ETH`}</div>
                                    <div><b>Promethean Relic: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.Promethean/100*charmzPrices[3], 6)} ETH`}</div>
                                    <div><b>Shredz: </b>
                                        <ul className="list-unstyled mb-1">
                                            <li>1x: {`${roundNumberToMaxDigits(results.inputs.runCount*results.OneShredz/100*shredzPrice, 6)} ETH`}</li>
                                            <li>2x: {`${roundNumberToMaxDigits(results.inputs.runCount*results.TwoShredz/100*shredzPrice*2, 6)} ETH`}</li>
                                            <li>4x: {`${roundNumberToMaxDigits(results.inputs.runCount*results.FourShredz/100*shredzPrice*4, 6)} ETH`}</li>
                                        </ul>
                                    </div>
                                    <div><b>Golden Ticket: </b>{`${roundNumberToMaxDigits(results.inputs.runCount*results.GoldenTicket/100*goldenTicketPrice, 6)} ETH`}</div>
                                    <div>
                                        <b>Kongium: </b>
                                        {`${roundNumberToMaxDigits(results.inputs.runCount*results.KongiumCombined/kongiumPricePerBanana*bananaPrice,6)} ETH`}
                                    </div>
                                    <div>
                                        <b>Combined: </b>
                                        {`
                                            ${roundNumberToMaxDigits((results.EmbComm/100*embCommPrice+results.EmbRare/100*embRarePrice+results.EmbEpic/100*embEpicPrice+results.EmbLege/100*embLegePrice
                                                +results.Cyber/100*charmzPrices[1]+results.Rainbow/100*charmzPrices[2]+results.Promethean/100*charmzPrices[3]
                                                +results.OneShredz/100*shredzPrice+results.TwoShredz/100*shredzPrice*2+results.FourShredz/100*shredzPrice*4
                                                +results.GoldenTicket/100*goldenTicketPrice+results.KongiumCombined/kongiumPricePerBanana*bananaPrice)*results.inputs.runCount,6)} ETH
                                        `}
                                    </div>

                                    <hr/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    }
    return <div>Loading...</div>
}

const roundNumberToMaxDigits = (number, digits) => {
    return Math.round(number*Math.pow(10, digits))/Math.pow(10, digits);
}

const calcCharmzNeedd = (runCount) => {
    if (runCount % 30 === 0) {
        return runCount / 30;
    }
    else {
        return Math.floor(runCount / 30 + 1);
    }
}

const togglePrices = () => {
    var x = document.getElementById("prices");
    if (x.style.display !== "block") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


export default Home;