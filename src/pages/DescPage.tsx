import React, {useEffect, useReducer, useState} from 'react';
import {io, Socket} from "socket.io-client";
import {useParams, useSearchParams} from "react-router-dom";
import {Suits} from "../types/Suits";
import coin from '../assets/images/icons/tenge.svg'
import backCard from '../assets/images/backCard.svg'
import {ICard} from "../types/Card";
import {IPlayer} from "../types/Player";
import {PlayerComponent} from "../components/PlayerComponent";
import {CardImage} from "../ui/CardImage";
import {GameStates} from "../types/GameStates";
import {TradeModalComponent} from "../components/TradeModalComponent";

interface IDesc {
    players: IPlayer[],
    myCards: ICard[],
    myMovedCard: ICard | null,
    myCoins: number,
    trumpedCard: ICard | null,
    isMyMove: boolean,
    gameState: GameStates,
    myBet: number,
    myAction: string
}

const tg = Telegram.WebApp

const DescPage = () => {
    const [searchParams] = useSearchParams()
    const sessionId = useParams().id
    const username = searchParams.get('name')
    const coins = Number(searchParams.get('coins'))
    const minBetQuery = Number(searchParams.get('minBet'))
    let step = 10;
    let queryId = tg.initDataUnsafe.query_id;

    const [minBet, setMinBet] = useState<number>(minBetQuery)
    const [minRaise, setMinRaise] = useState<number>(minBetQuery)
    const [maxRaise, setMaxRaise] = useState<number>(minBetQuery * 5)
    const [canUpBet, setCanUpBet] = useState<boolean>(true)
    const [canCallBet, setCanCallBet] = useState<boolean>(true)
    const [descBet, setDescBet] = useState<number>(0)
    const [inputValue, setInputValue] = useState<number>(minBetQuery)

    const [socket, setSocket] = useState<Socket | null>(null)

    const [bank, setBank] = useState<number>(0)

    const initValues: IDesc = {
        players: [],
        myCards: [],
        myMovedCard: null,
        myCoins: coins,
        trumpedCard: null,
        isMyMove: false,
        gameState: GameStates.TRADE,
        myBet: 0,
        myAction: ''
    }

    const [desc, updateDesc] = useReducer(
        (state: IDesc, updates: any) => ({...state, ...updates}),
        initValues
    );

    window.scrollTo(0, document.body.scrollHeight);

    useEffect(() => {
        let socketIO = io('https://azi-backend.onrender.com')

        setSocket(socketIO)

        socketIO.emit('playerConnect', sessionId, username, coins, minBetQuery, tg.initDataUnsafe.query_id)

        socketIO.on('error', error => console.log(error))

        socketIO.on('newPlayerJoin', newPlayerJoinHandler)

        socketIO.on('cardHandout', cardHandoutHandler)

        socketIO.on('bet', betHandler)

        socketIO.on('tradeEnd', tradeEndHandler)

        socketIO.on('blindTradeEnd', blindTradeEndHandler)

        socketIO.on('move', moveHandler)

        socketIO.on('roundEnd', roundEndHandler)

        socketIO.on('playerLeave', (players : IPlayer[]) => {
            initPlayers(players)
        })


        tg.onEvent('viewportChanged', () => {
            if (!tg.isExpanded) tg.expand()
        })

        tg.ready()
        tg.expand()


        return () => {
            socketIO.disconnect()
        }

    }, [])

    function blindTradeEndHandler(players: IPlayer[], bank: number, descBet : number) {
        const me = initPlayers(players)
        const minRaiseValue = descBet === minBet ? minBet : descBet * 2
        setBank(bank)
        setDescBet(descBet)
        setMinRaise(minRaiseValue)
        setMaxRaise(descBet * 5 > me.coins ? me.coins : descBet * 5)
        setCanCallBet(false)
        if (minRaiseValue > me.coins) {
            setInputValue(descBet === minBet ? minBet : me.coins)
            setCanUpBet(false)
        }
        else {
            setCanUpBet(true)
            setInputValue(minRaiseValue)
        }
        updateDesc({gameState : GameStates.TRADE})
    }

    function tradeEndHandler(players: IPlayer[], bank: number) {
        const me = initPlayers(players)
        setBank(bank)
        console.log('Trade end')

        if (me.active) {
            for (const card of me.cards) {
                card.canMove = true
            }
        }

        updateDesc({gameState: GameStates.ROUND, myCards : me.cards})
    }

    function betHandler(players: IPlayer[], bank : number, minRaise : number, maxRaise : number, descBet : number, canCallValue : boolean, allIn : boolean, canUpBet : boolean) {
        const me = initPlayers(players)

        if (me.move && allIn) {
            setInputValue(me.coins)
            setCanUpBet(false)
        }
        else {
            setMinRaise(minRaise)
            setMaxRaise(maxRaise)
            setInputValue(canCallValue ? minRaise - step : minRaise)
            setCanUpBet(canUpBet)
        }

        setBank(bank)
        setDescBet(descBet)
        setCanCallBet(canCallValue)
    }

    function roundEndHandler(msg: string, players: IPlayer[], bank: number) {
        console.log(msg)
        const me = initPlayers(players)

        if (me.active) {
            for (const card of me.cards) {
                card.canMove = true
            }
        }

        updateDesc({myCards: me.cards, myMovedCard: null})
        setBank(bank)
        setMinRaise(minBet)
        setMaxRaise(minBet * 5)
        setInputValue(minBet)
    }

    function moveHandler(players: IPlayer[], dealer: Suits, trumped: Suits) {
        const me = initPlayers(players)

        const myCards = me.cards

        if (me.move) {
            if (myCards) {
                const dealerCards = myCards.filter(card => card.suit === dealer)
                const trumpedCards = myCards.filter(card => card.suit === trumped)
                let selectedDeck;

                if (dealerCards.length !== 0) {
                    selectedDeck = dealerCards
                } else if (trumpedCards.length !== 0) {
                    selectedDeck = trumpedCards
                } else {
                    selectedDeck = myCards
                }

                for (const card of selectedDeck) {
                    card.canMove = true
                }
            }
        }

        updateDesc({myMovedCard: me.movedCard})

        if (me.active)
            updateDesc({myCards: myCards})
    }

    function newPlayerJoinHandler(players: IPlayer[], trumpedCard: ICard | null) {
        initPlayers(players)
        if (trumpedCard) updateDesc({trumpedCard})
    }

    function initPlayers(players: IPlayer[]): IPlayer {
        let sortedPlayers: IPlayer[] = [];

        players.forEach((player, index) => {
            if (queryId === player.queryId) {
                sortedPlayers = [...players.slice(index + 1), ...players.slice(0, index)]
            }
        })

        const me = players.filter(player => queryId === player.queryId)[0]

        updateDesc({isMyMove: me.move, players: sortedPlayers, myCoins: me.coins, myBet: me.bet, myCards: me.cards, myAction : me.action})
        return me
    }

    function cardHandoutHandler(players: IPlayer[], trumpedCard: ICard, minBet: number, bank: number, bet : number | undefined) {
        const me = initPlayers(players)
        setMinBet(minBet)
        setBank(bank)
        setCanUpBet(true)
        if (bet) {
            setMinRaise(bet > me.coins ? me.coins : bet)
            setMinRaise(bet > me.coins ? me.coins : bet)
            setInputValue(bet > me.coins ? me.coins : bet)
            setCanCallBet(false)
            setCanUpBet(false)
        }
        else {
            setInputValue(minBet)
            setMaxRaise(minBet * 5 > me.coins ? me.coins : minBet * 5)
        }
        setCanCallBet(false)
        updateDesc({trumpedCard, myCoins: me.coins, gameState: GameStates.BLINDTRADE})
    }

    function move(card: ICard) {
        socket?.emit('move', card, sessionId)
    }

    function bet(betValue: number, action: string) {
        socket?.emit('bet', betValue, action, sessionId)
    }

    return (
        <>
            <span className="roomInfo__id">#{sessionId}</span>
            <div className='desc'>
                <div className="desc__item">
                    <PlayerComponent position={'bottom'} player={desc.players[2]}/>
                </div>
                <div className="desc__item">
                    <PlayerComponent position={'bottom-right'} player={desc.players[1]}/>
                    <PlayerComponent inverse={true} position={'bottom-left'} player={desc.players[3]}/>
                </div>
                <div className="desc__item desc__item--trumped">
                    {desc.gameState === GameStates.BLINDTRADE ? <img src={backCard} alt=""/> :
                        <CardImage card={desc.trumpedCard}/>}
                </div>
                <div className="desc__item">
                    <PlayerComponent position={'top-right'} player={desc.players[0]}/>
                    <div className="bank">
                        <div className="bank__label">Банк</div>
                        <div className="bank__value">{bank}</div>
                    </div>
                    <div className="myMovedCard">
                        <CardImage card={desc.myMovedCard}/>
                    </div>
                    <PlayerComponent inverse={true} position={'top-left'} player={desc.players[4]}/>
                </div>

                <div className="roomInfo">
                    <div className={`myAction myAction--${desc.myAction}`}>
                        {
                            desc.myAction === 'raise' ? 'Поднял' : desc.myAction === 'call' ? 'Уровнял' : desc.myAction === 'allIn' ? 'Ва-банк' : desc.myAction === 'round' ? 'Раунд' : null
                         }
                    </div>
                    <div className="myCoins">
                        <span className="myCoins__value">{desc.myCoins}</span>
                        <img className="myCoins__icon" src={coin} alt=""/>
                    </div>
                </div>

                <div
                    className={`myCards ${((desc.gameState === GameStates.TRADE || desc.gameState === GameStates.BLINDTRADE) && desc.isMyMove) || (desc.gameState === GameStates.ROUND && !desc.isMyMove) ? 'myCards__inactive' : ''}`}>
                    {
                        desc.myCards?.map((card: ICard) =>
                            <div
                                className={`myCards__card ${!card.canMove ? 'myCards__card--inactive' : ''}`}
                                key={card.suit + card.value}
                                onClick={desc.gameState === GameStates.TRADE || desc.gameState === GameStates.BLINDTRADE || !card.canMove ? undefined : () => move(card)}
                            >
                                {desc.gameState === GameStates.BLINDTRADE ? <img src={backCard} alt=""/> :
                                    <CardImage card={card}/>}
                            </div>
                        )
                    }
                </div>

                <TradeModalComponent
                    gameState={desc.gameState}
                    minRaise={minRaise}
                    maxRaise={maxRaise}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    myCoins={desc.myCoins}
                    myBet={desc.myBet}
                    active={(desc.gameState === GameStates.TRADE || desc.gameState === GameStates.BLINDTRADE) && desc.isMyMove}
                    bet={bet}
                    minBet={minBet}
                    step={step}
                    canUpBet={canUpBet}
                    canCallBet={canCallBet}
                    descBet={descBet}
                />
            </div>
        </>
    );
};


export default DescPage;