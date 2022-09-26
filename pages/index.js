import useSWR from 'swr';
import {useEffect, useState} from "react";
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import TextInput from "../components/textInput";
import Select from "../components/select";
import Checkbox from "../components/checkbox";

const fetcher = (url) => fetch(url).then((res) => res.json());

const constants = Object.freeze({
    BANANA_PER_RUN: 0.4
})

const Home = () => {
    const [bananaPrice, setBananaPrice] = useState(0)
    const [cyberPrice, setCyberPrice] = useState(0.005)
    const [rainbowPrice, setRainbowPrice] = useState(0.05)
    const [promPrice, setPromPrice] = useState(0.8)
    const [embCommPrice, setEmbCommPrice] = useState(0.005)
    const [embRarePrice, setEmbRarePrice] = useState(0.03)
    const [embEpicPrice, setEmbEpicPrice] = useState(0.1)
    const [embLegePrice, setEmbLegePrice] = useState(0.8)
    const [wlVouchPrice, setWlVouchPrice] = useState(0.02)
    const [shredzPrice, setShredzPrice] = useState(0.15)
    const [goldenTicketPrice, setGoldenTicketPrice] = useState(1.2)
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
        console.log(results)
    }, [results])

    if (eError || bananaError) return <div>Failed to load</div>;

    if (bananaPrice && eData) {
        let eventData = JSON.parse(eData);

        return <div>
            <h2>Configuration for runs:</h2>
            <Formik
                initialValues={{
                    fuelRodRun: false,
                    charmz: 0,
                    teamSize: 1,
                    teamLevel: 1,
                    highestLevelKong: 1,
                }}
                validationSchema={Yup.object({
                    fuelRodRun: Yup.boolean(),
                    charmz: Yup.number(),
                    teamSize: Yup.number(),
                    teamLevel: Yup.number(),
                    highestLevelKong: Yup.number(),
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        console.log(eventData)
                        let resultsFromCalc = {
                            "Kongium": 0,
                            "Exp": 0,
                            "Cyber": 0,
                            "Rainbow": 0,
                            "Promethean": 0,
                            "EmbComm": 0,
                            "EmbRare": 0,
                            "EmbEpic": 0,
                            "EmbLege": 0,
                            "WhitelistV": 0,
                            "Shredz": 0,
                            "GoldenTicket": 0,
                        }
                        eventData
                            .filter(e => values.fuelRodRun || e.eventType !== "Rod")
                            .filter(e => Number(values.charmz) >= e.charmReq)
                            .filter(e => Number(values.teamSize) >= e.teamSizeReq)
                            .filter(e => Number(values.teamLevel) >= e.teamLvlReq)
                            .filter(e => Number(values.highestLevelKong) >= e.lvlReq)
                            .forEach(e => {
                                switch (e.rewardType) {
                                    case "Kongium":
                                        resultsFromCalc.Kongium += e.chance * e.rewardAmount;
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
                                        resultsFromCalc.Shredz += e.chance * e.rewardAmount;
                                        break;
                                    case "GoldenTicket":
                                        resultsFromCalc.GoldenTicket += e.chance * e.rewardAmount;
                                        break;
                                }
                            })
                        setResults(resultsFromCalc)

                        setSubmitting(false);
                    }, 100);
                }}
            >
                <Form>
                    <Checkbox label="Fuel Rod Run" name="fuelRodRun">
                        Using fuel rods for runs.
                    </Checkbox>

                    <Select label="Charmz" name="charmz">
                        <option value={0}>None</option>
                        <option value={1}>Cyber Fragment</option>
                        <option value={2}>Rainbow Crystal</option>
                        <option value={3}>Promethean Relic</option>
                    </Select>

                    <Select label="Team Size" name="teamSize">
                        {[...Array(5)].map((x, i) =>
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        )}
                    </Select>

                    <Select label="Team Level (combined)" name="teamLevel">
                        <option value="5">1-5</option>
                        <option value="7">6-7</option>
                        <option value="9">8-9</option>
                        <option value="14">10-14</option>
                        <option value="15">15</option>
                        <option value="19">16-19</option>
                        <option value="29">20-29</option>
                        <option value="34">30-34</option>
                        <option value="35">35+</option>
                    </Select>

                    <Select label="Level of highest Kong" name="highestLevelKong">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">3-4</option>
                        <option value="6">5-6</option>
                        <option value="7">7</option>
                        <option value="8">8-9</option>
                        <option value="20">10-20</option>
                    </Select>
                    <br/>
                    <button type="submit">Calculate</button>
                </Form>
            </Formik>
            <div>
                <h2>Resulting chances for one run:</h2>
                {Object.keys(results).length !== 0 &&
                    <div>
                        <div>Embattle Common: {results.EmbComm}% chance</div>
                        <div>Embattle Rare: {results.EmbRare}% chance</div>
                        <div>Embattle Epic: {results.EmbEpic}% chance</div>
                        <div>Embattle Legendary: {results.EmbLege}% chance</div>
                        <div>WL Voucher: {results.WhitelistV}% chance</div>
                        <div>Shredz: {results.Shredz}% chance</div>
                        <div>Golden Ticket: {results.GoldenTicket}% chance</div>
                    </div>
                }

            </div>
            <br/>
            <hr/>
            <div>
                <h3>Prices:<button>Toggle</button> </h3>
                <div className="d-none">
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
                                label="Banana price in Ether (current price from Coingecko)"
                                name="nanaPrice"
                                type="text"
                            />
                            <br/>
                            <br/>
                            <button type="submit">Set my own Banana price</button>
                        </Form>
                    </Formik>
                    <br/>

                    <Formik
                        initialValues={{
                            cyberPriceVal: cyberPrice,
                            rainbowPriceVal: rainbowPrice,
                            promPriceVal: promPrice,
                            embCommPriceVal: embCommPrice,
                            embRarePriceVal: embRarePrice,
                            embEpicPriceVal: embEpicPrice,
                            embLegePriceVal: embLegePrice,
                            wlVouchPriceVal: wlVouchPrice,
                            shredzPriceVal: shredzPrice,
                            goldenTicketPriceVal: goldenTicketPrice,
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
                        })}
                        onSubmit={(values, {setSubmitting}) => {
                            setTimeout(() => {
                                setCyberPrice(Number(values.cyberPriceVal))
                                setRainbowPrice(Number(values.rainbowPriceVal))
                                setPromPrice(Number(values.promPriceVal))
                                setEmbCommPrice(Number(values.embCommPriceVal))
                                setEmbRarePrice(Number(values.embRarePriceVal))
                                setEmbEpicPrice(Number(values.embEpicPriceVal))
                                setEmbLegePrice(Number(values.embLegePriceVal))
                                setWlVouchPrice(Number(values.wlVouchPriceVal))
                                setShredzPrice(Number(values.shredzPriceVal))
                                setGoldenTicketPrice(Number(values.goldenTicketPriceVal))
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
                                label="Whitelist Voucher"
                                name="wlVouchPriceVal"
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
                            />
                            <br/>
                            <br/>
                            <button type="submit">Set my own loot prices</button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    }

    return <div>Loading...</div>
}


export default Home;