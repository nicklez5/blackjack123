import React, { Component, useState } from 'react'
import './styles.css'
export class Blackjack extends Component {

  constructor(props){
    super(props);
    this.state = {
        deck: [],
        num_of_deck: 4,
        current_num_decks: 1,
        x_val_cards: new Map(),
        total_num_cards_dealt: 3,
        card_style: 'card',
        card_split_style: ['card','card-left-split','card-right-split'],
        bet_amount: 0,
        left_bet_amount: 0,
        right_bet_amount: 0,
        wallet_amount: 4000,
        game_over: false,
        left_side_hand: [],
        right_side_hand: [],
        player_hand: [],
        dealer_hand: [],
        start_dealer_hit: false,
        current_count_value: 0,
        dealer_count_value: 0,
        left_count_value: 0,
        right_count_value: 0,
        message: '',
        continue: false,
        card_left_side: false,
        card_right_side: false,
        card_split_boolean: false,
    }
    this.start_game();
  };

  // Run statements that the component is already placed in the DOM
  componentDidMount(){
    //this.start_game();
    //console.log("Current number of decks: ", this.state.current_num_decks);
  }

  // start inserting cards and 
  start_game(){
    const pairs_symbol = ['♥','♦','♠️','♣️']
    const numbers = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
    //const numbers = ['7','7','7','7','7','7','7','7','7','7','7','7','7']
    for(let i = 0; i < 4 ; i++){
        for(let j = 0; j < pairs_symbol.length; j++){
            for(let k = 0; k < numbers.length; k++){
                this.state.deck.push({number: numbers[k], suit: pairs_symbol[j]})
            }
        }
    }
    
    this.state.deck.sort((a,b) => 0.5 - Math.random());
    console.log(this.state.deck)

    const dealer_card_1 = this.state.deck.shift();
    this.state.dealer_hand.push(dealer_card_1);
    
    //console.log("This is the dealer cards: ", this.state.dealer_hand);
    this.calculate_dealer_card_value(dealer_card_1);

    const player_card_1 = this.state.deck.shift()
    this.state.player_hand.push(player_card_1);

    const player_card_2 = this.state.deck.shift();
    this.state.player_hand.push(player_card_2);
    
    //console.log("This is the player cards: ",this.state.player_hand)
    this.initialize_card_count();
    this.initialize_player_cards_value(player_card_1, player_card_2);
    //console.log([...this.state.x_val_cards.entries()]);
    //console.log("Current count value: " + this.state.current_count_value);
    console.log("Initial Left Count Value: " + this.state.left_count_value);
    console.log("Initial Right Count Value: " + this.state.right_count_value);
  }



  calculate_dealer_card_value(first_card){
    const A_set = new Set(['A']);
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    if(A_set.has(first_card.number)){
        this.state.dealer_count_value = 11;
    }else if(Num_set.has(first_card.number)){
        const card_value = Number(first_card.number);
        this.state.dealer_count_value = card_value;
    }else if(Face_set.has(first_card.number)){
        this.state.dealer_count_value = 10;
    }
  }
  initialize_player_cards_value(first_card, second_card){
    const A_set = new Set(['A']);
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    if(A_set.has(first_card.number) === true && A_set.has(second_card.number) === true){
        if(this.state.card_split_boolean){
            this.state.left_count_value = 11;
            this.state.right_count_value = 11;
        }else{
            this.state.current_count_value = 2;
        }
    }else if(A_set.has(first_card.number) === true && Num_set.has(second_card.number) === true){
        const first_card_value = 11;
        const second_card_value = Number(second_card.number);
        this.state.current_count_value = first_card_value + second_card_value;
    }
    else if(Num_set.has(first_card.number) === true && A_set.has(second_card.number) === true){
        const first_card_value = Number(first_card.number);
        const second_card_value = 11;
        this.state.current_count_value = first_card_value + second_card_value;
    }else if(A_set.has(first_card.number) === true && Face_set.has(second_card.number) === true){
        this.state.current_count_value = 21;
    }else if(Face_set.has(first_card.number) === true && A_set.has(second_card.number) === true){
        this.state.current_count_value = 21;
    }else if(Face_set.has(first_card.number) === true && Num_set.has(second_card.number) === true){
        const first_card_value = 10;
        const second_card_value = Number(second_card.number);
        this.state.current_count_value = first_card_value + second_card_value;
    }else if(Num_set.has(first_card.number) === true && Face_set.has(second_card.number) === true){
        const first_card_value = Number(first_card.number);
        const second_card_value = 10;
        this.state.current_count_value = first_card_value + second_card_value;
    }else if(Num_set.has(first_card.number) === true && Num_set.has(second_card.number) === true){
        const first_card_value = Number(first_card.number);
        const second_card_value = Number(second_card.number);
        if(this.state.card_split_boolean){
            this.state.left_count_value = first_card_value;
            this.state.right_count_value = second_card_value;
        }else{
            this.state.current_count_value = first_card_value + second_card_value;
        }
    }else if(Face_set.has(first_card.number) === true && Face_set.has(second_card.number) === true){
        if(this.state.card_split_boolean){
            this.state.left_count_value = 10;
            this.state.right_count_value = 10;
        }else{
            this.state.current_count_value = 20;
        }
        
    }
     
    
  }
  initialize_card_count(){
    let dealer_hand_number = this.state.dealer_hand[0];
    let player_hand_number_1 = this.state.player_hand[0];
    let player_hand_number_2 = this.state.player_hand[1];
    this.state.x_val_cards.set(dealer_hand_number.number,1);
    this.state.x_val_cards.set(player_hand_number_1.number,1);
    this.state.x_val_cards.set(player_hand_number_2.number,1);
    console.log("Initializing card count:");
    console.log([...this.state.x_val_cards.entries()])
    this.setState({
        x_val_cards: this.state.x_val_cards
    })
  }

  // Add a card on either the left/right/middle 
  hit_me(){
    if(this.state.card_left_side && !this.state.card_right_side){
        if(this.state.game_over === false){
            this.state.total_num_cards_dealt += 1;
            var random_card = this.state.deck.shift();
            this.state.left_side_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            //this.new_add_in_player_cards_value(random_card);
            console.log("Left Count Value: " + this.state.left_count_value);
            this.setState({
                left_side_hand: this.state.left_side_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt
                
            })
        }
        if(this.state.left_count_value > 21){
            this.setState({
                message: "You Lost!",
                left_bet_amount: 0,
                continue: true,
                card_left_side: false,
                card_right_side: true,
            })
        }
    }else if(!this.state.card_left_side && this.state.card_right_side){
        if(this.state.game_over === false){
            this.state.total_num_cards_dealt += 1;
            var random_card = this.state.deck.shift();
            this.state.right_side_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            //this.new_add_in_player_cards_value(random_card);
            this.setState({
                right_side_hand: this.state.right_side_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt
                
            })
        }
        if(this.state.right_count_value > 21){
            this.setState({
                continue: true,
                message: "You Lost!",
                right_bet_amount: 0,
                game_over: true,
                card_right_side: false,
            })
        }
    }else if(!this.state.card_left_side && !this.state.card_right_side){
        if(this.state.game_over === false){
            this.state.total_num_cards_dealt += 1;
            var random_card = this.state.deck.shift();
            this.state.player_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            //this.new_add_in_player_cards_value(random_card);
            this.setState({
                player_hand: this.state.player_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt
                
            })
        }
        if(this.state.current_count_value > 21){
            this.setState({
                message: "You Lost!",
                bet_amount: 0,
                continue: true,
                game_over: true,
            })
        }
    }
    //console.log(this.state.player_hand)
  }
  add_x_val_cards_probability(etc_card){
    var num_of_times_seen = 0;
    if(this.state.x_val_cards.has(etc_card.number)){
        num_of_times_seen = this.state.x_val_cards.get(etc_card.number);
        num_of_times_seen += 1;
        this.state.x_val_cards.set(etc_card.number,num_of_times_seen);
    }else{
        this.state.x_val_cards.set(etc_card.number,1);
    }

    this.setState({
        x_val_cards: this.state.x_val_cards
    })

  }
  check_if_aces_dealer(){
    //console.log("Player Hands:")
    for(let i = 0; i < this.state.dealer_hand.length; i++){
        if(this.state.dealer_hand[i].number === "A"){
            return true;
        }
    }
    return false;
  }
  check_if_aces(){
    //console.log("Player Hands:")
    if(this.state.card_left_side && !this.state.card_right_side){
        for(let i = 0; i < this.state.left_side_hand.length; i++){
            if(this.state.left_side_hand[i].number === "A"){
                return true;
            }
        }
        return false;
    }else if(this.state.card_right_side && !this.state.card_left_side){
        for(let i = 0; i < this.state.right_side_hand.length; i++){
            if(this.state.right_side_hand[i].number === "A"){
                return true;
            }
        }
        return false;
    }else if(!this.state.card_left_side && !this.state.card_right_side){
        for(let i = 0; i < this.state.player_hand.length; i++){
            if(this.state.player_hand[i].number === "A"){
                return true;
            }
        }
        return false;
    }
  }
  redo_all_dealer(){
    const A_set = new Set(['A'])
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    let total_value = 0;
    for(let i = 0; i < this.state.dealer_hand.length; i++){
        if(A_set.has(this.state.dealer_hand[i].number)){
            total_value += 1;
        }else if(Num_set.has(this.state.dealer_hand[i].number)){
            const num_value = Number(this.state.dealer_hand[i].number);
            total_value += num_value;
        }else if(Face_set.has(this.state.dealer_hand[i].number)){
            total_value += 10;
        }
    }
    return total_value;
  }
  redo_all(){
    const A_set = new Set(['A'])
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    let total_value = 0;
    if(this.state.card_left_side && !this.state.card_right_side){
        for(let i = 0; i < this.state.left_side_hand.length; i++){
            if(A_set.has(this.state.left_side_hand[i].number)){
                total_value += 1;
            }else if(Num_set.has(this.state.left_side_hand[i].number)){
                const num_value = Number(this.state.left_side_hand[i].number);
                total_value += num_value;
            }else if(Face_set.has(this.state.left_side_hand[i].number)){
                total_value += 10;
            }
        }
    }else if(this.state.card_right_side && !this.state.card_left_side){
        for(let i = 0; i < this.state.right_side_hand.length; i++){
            if(A_set.has(this.state.right_side_hand[i].number)){
                total_value += 1;
            }else if(Num_set.has(this.state.right_side_hand[i].number)){
                const num_value = Number(this.state.right_side_hand[i].number);
                total_value += num_value;
            }else if(Face_set.has(this.state.right_side_hand[i].number)){
                total_value += 10;
            }
        }
    }else if(!this.state.card_right_side && !this.state.card_left_side){
        for(let i = 0; i < this.state.player_hand.length; i++){
            if(A_set.has(this.state.player_hand[i].number)){
                total_value += 1;
            }else if(Num_set.has(this.state.player_hand[i].number)){
                const num_value = Number(this.state.player_hand[i].number);
                total_value += num_value;
            }else if(Face_set.has(this.state.player_hand[i].number)){
                total_value += 10;
            }
        }
    }
    return total_value;
  }
  add_in_player_cards_value(card_random){
    const A_set = new Set(['A']);
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    var get_random_card_value = 0;
    if(A_set.has(card_random.number)){
        if(this.state.current_count_value <= 10){
            get_random_card_value = 11;
        }else{
            get_random_card_value = 1;
        }
    }else if(Num_set.has(card_random.number)){
        get_random_card_value = Number(card_random.number);
    }else if(Face_set.has(card_random.number)){
        get_random_card_value = 10;
    } 
    if(this.state.card_left_side && !this.state.card_right_side){
        let total_value = this.state.left_count_value + get_random_card_value;
        if(this.check_if_aces() && total_value > 21){
            this.state.left_count_value = this.redo_all();
            this.setState({
                left_count_value : this.redo_all()
            })
        }else{
            this.state.left_count_value = total_value;
            this.setState({
                left_count_value : total_value
            })
        }
    }else if(this.state.card_right_side && !this.state.card_left_side){
        let total_value = this.state.right_count_value + get_random_card_value;
        if(this.check_if_aces() && total_value > 21){
            this.state.right_count_value = this.redo_all();
        }else{
            this.state.right_count_value = total_value;
        } 
    }else if(!this.state.card_left_side && !this.state.card_right_side){
        let total_value = this.state.current_count_value + get_random_card_value;
        if(this.check_if_aces() && total_value > 21){
            this.state.current_count_value = this.redo_all();
        }else{
            this.state.current_count_value = total_value;
        } 
    }

  }
  add_in_dealers_cards_value(card_random){
    const A_set = new Set(['A']);
    const Num_set = new Set(['2','3','4','5','6','7','8','9'])
    const Face_set = new Set(['10','J','Q','K'])
    var get_random_card_value = 0;
    if(A_set.has(card_random.number)){
        if(this.state.dealer_count_value <= 10){
            get_random_card_value = 11;
        }else{
            get_random_card_value = 1;
        }
    }else if(Num_set.has(card_random.number)){
        get_random_card_value = Number(card_random.number);
    }else if(Face_set.has(card_random.number)){
        get_random_card_value = 10;
    }
    
    let total_value = this.state.dealer_count_value + get_random_card_value; 
    //this.state.current_count_value = total_value;
    if(this.check_if_aces_dealer() && total_value > 21){
        this.state.dealer_count_value = this.redo_all_dealer();
    }else{
        this.state.dealer_count_value = total_value;
    }
  }
  // Increase the current bet amount by two and hit the card on either left/right/middle
  double_me(){
    let aftermath_amount = this.state.wallet_amount - this.state.bet_amount;
    if(aftermath_amount >= 0 && this.state.game_over === false){
        this.state.total_num_cards_dealt = this.state.total_num_cards_dealt + 1;
        var random_card = this.state.deck.shift();
        if(this.state.card_left_side && !this.state.card_right_side){
            this.state.left_side_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            this.setState({
                left_side_hand: this.state.left_side_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt,
                bet_amount: this.state.bet_amount * 2,
                wallet_amount: this.state.wallet_amount - this.state.bet_amount
            })
        }else if(!this.state.card_left_side && this.state.card_right_side){
            this.state.right_side_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            this.setState({
                right_side_hand: this.state.right_side_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt,
                bet_amount: this.state.bet_amount * 2,
                wallet_amount: this.state.wallet_amount - this.state.bet_amount
            })
        }else if(!this.state.card_left_side && !this.state.card_right_side){
            this.state.player_hand.push(random_card);
            this.add_in_player_cards_value(random_card);
            this.add_x_val_cards_probability(random_card);
            this.setState({
                player_hand: this.state.player_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt,
                bet_amount: this.state.bet_amount * 2,
                wallet_amount: this.state.wallet_amount - this.state.bet_amount
            })
        }
    }else if(aftermath_amount < 0 && this.state.game_over === false){
        this.setState({
            bet_amount: this.state.bet_amount,
            wallet_amount: this.state.wallet_amount
        })
    }
    var current_count; 
    if(this.state.card_left_side && !this.state.card_right_side){
        current_count = this.state.left_count_value; 
    }else if(!this.state.card_left_side && this.state.card_right_side){
        current_count = this.state.right_count_value;
    }else if(!this.state.card_left_side && !this.state.card_right_side){
        current_count = this.state.current_count_value;
    }
    if(current_count > 21){
        this.setState({
            message: "You Lost!",
            continue: true,
            game_over: true,
            bet_amount: 0
        })
    }
    
  }


  // Split the cards into left and right side
  split_me(){
    if(this.state.player_hand[0].number === this.state.player_hand[1].number){
        const left_element = this.state.player_hand.shift();
        this.state.left_side_hand.push(left_element);
        const right_element = this.state.player_hand.shift();
        this.state.right_side_hand.push(right_element);
        this.state.card_split_boolean = true;
        this.initialize_player_cards_value(left_element,right_element);
        this.setState({
            left_side_hand: this.state.left_side_hand,
            right_side_hand: this.state.right_side_hand,
            card_split_boolean: true,
            card_left_side: true,
        })
    }

  }

  // Stand on card that you're currently on left/right/middle
  stand_me(){
    if(this.state.card_left_side && !this.state.card_right_side){
        this.setState({
            card_left_side: false,
            card_right_side: true
        })
    }else if(!this.state.card_left_side && this.state.card_right_side){
        while(this.state.dealer_count_value < 17){
            const new_dealer_card = this.state.deck.shift();
            this.state.dealer_hand.push(new_dealer_card);
            this.state.total_num_cards_dealt += 1;
            this.add_in_dealers_cards_value(new_dealer_card);
            this.add_x_val_cards_probability(new_dealer_card);
            this.setState({
                dealer_count_value: this.state.dealer_count_value,
                dealer_hand: this.state.dealer_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt
            })
        }

    }else if(!this.state.card_left_side && !this.state.card_right_side){
        while(this.state.dealer_count_value < 17){
            const new_dealer_card = this.state.deck.shift();
            this.state.dealer_hand.push(new_dealer_card);
            this.state.total_num_cards_dealt += 1;
            this.add_in_dealers_cards_value(new_dealer_card);
            this.add_x_val_cards_probability(new_dealer_card);
            this.setState({
                dealer_count_value: this.state.dealer_count_value,
                dealer_hand: this.state.dealer_hand,
                total_num_cards_dealt: this.state.total_num_cards_dealt
            })
            
        }
    }
    
 
    //Finished both sides 
    if(!this.state.card_left_side && this.state.card_right_side){
        //Dealer exceeds 21 and left does not exceed but right does.
        if((this.state.dealer_count_value > 21 && this.state.left_count_value <= 21) && (this.state.dealer_count_value > 21 && this.state.right_count_value > 21)){
            let new_amount = this.state.left_bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You won!",
                game_over: true,
                continue: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer exceeds 21 and right does not exceed 21 but left does.
        }else if((this.state.dealer_count_value > 21 && this.state.right_count_value <= 21) && (this.state.dealer_count_value > 21 && this.state.left_count_value > 21)){
            let new_amount = this.state.right_bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You won!",
                game_over: true,
                continue: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                wallet_amount: this.state.wallet_amount
            })
        // Dealer exceeds 21 and left/right both under 21.
        }else if((this.state.dealer_count_value > 21 && this.state.left_count_value <= 21) && (this.state.dealer_count_value > 21 && this.state.right_count_value <= 21)){
            let right_amount = this.state.right_bet_amount;
            right_amount = right_amount * 2;
            let left_amount = this.state.left_bet_amount;
            left_amount = left_amount * 2;
            this.state.wallet_amount += right_amount;
            this.state.wallet_amount += left_amount;
            this.setState({
                message: "You won!",
                game_over: true,
                continue: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                wallet_amount: this.state.wallet_amount
            })
        }
        //Dealer equals 21 and left is equal to 21 while right is not equivalent to 21.
        else if(((this.state.dealer_count_value === 21 && this.state.left_count_value === 21) || (this.state.dealer_count_value === this.state.left_count_value)) && ((this.state.dealer_count_value === 21 && this.state.right_count_value !== 21) || (this.state.dealer_count_value !== this.state.right_count_value))) {
            this.state.wallet_amount += this.state.left_bet_amount;
            this.setState({
                message : "Its a tie!",
                continue: true,
                game_over: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer equals 21 and right is equal to 21 while left is not equivalent to 21.
        }else if(((this.state.dealer_count_value === 21 && this.state.right_count_value === 21) || (this.state.dealer_count_value === this.state.right_count_value)) && ((this.state.dealer_count_value === 21 && this.state.left_count_value !== 21) || (this.state.dealer_count_value !== this.state.left_count_value))){
            this.state.wallet_amount += this.state.right_bet_amount;
            this.setState({
                message : "Its a tie!",
                continue: true,
                game_over: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                card_left_side: false,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer equals 21 and the right and left side are both equal to 21
        }else if(((this.state.dealer_count_value === 21 && this.state.right_count_value === 21) || (this.state.dealer_count_value === this.state.right_count_value)) && ((this.state.dealer_count_value === 21 && this.state.left_count_value === 21) || (this.state.dealer_count_value === this.state.left_count_value))){
            this.state.wallet_amount += this.state.left_bet_amount;
            this.state.wallet_amount += this.state.right_bet_amount;
            this.setState({
                message : "Its a tie!",
                continue: true,
                game_over: true,
                right_bet_amount: 0,
                card_right_side: false,
                card_left_side: false,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer equal/under 21 and dealer is bigger than left and right side
        }else if((this.state.dealer_count_value <= 21 && this.state.dealer_count_value > this.state.left_count_value)  && (this.state.dealer_count_value <= 21 && this.state.dealer_count_value > this.state.right_count_value)){
            this.setState({
                message: "You've lost!",
                continue: true,
                game_over: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                card_right_side: false,
                card_left_side: false,
            })
        //Dealer equal/under 21 but left is bigger than dealer n the right side is lower than dealer
        }else if((this.state.dealer_count_value <= 21 && this.state.dealer_count_value < this.state.left_count_value) && (this.state.dealer_count_value <= 21 && this.state.dealer_count_value > this.state.right_count_value)){
            let new_amount = this.state.left_bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You've won!",
                continue: true,
                game_over: true,
                left_bet_amount: 0,
                wallet_amount: this.state.wallet_amount,
                card_right_side: false,
            })
        //Dealer equal/under 21 but right is bigger than dealer n the left side is lower than dealer
        }else if((this.state.dealer_count_value <= 21 && this.state.dealer_count_value < this.state.right_count_value) && (this.state.dealer_count_value <= 21 && this.state.dealer_count_value > this.state.left_count_value)){
            let new_amount = this.state.right_bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You've won!",
                continue: true,
                game_over: true,
                right_bet_amount: 0,
                wallet_amount: this.state.wallet_amount,
                card_right_side: false,
            })
        //Dealer equal/under 21 but both left and right side exceeds Dealer
        }else if((this.state.dealer_count_value <= 21 && this.state.dealer_count_value < this.state.right_count_value) && (this.state.dealer_count_value <= 21 && this.state.dealer_count_value < this.state.left_count_value)){
            let right_amount = this.state.right_bet_amount;
            right_amount = right_amount * 2;
            this.state.wallet_amount += right_amount;
            let left_amount = this.state.left_bet_amount;
            left_amount = left_amount * 2;
            this.state.wallet_amount += left_amount;
            this.setState({
                message: "You've won!",
                continue: true,
                game_over: true,
                left_bet_amount: 0,
                right_bet_amount: 0,
                wallet_amount: this.state.wallet_amount,
                card_right_side: false,
            })
        }
    //Regular count in the middle
    }else if(!this.state.card_split_boolean){

        //Dealer has exceeded 21
        if(this.state.dealer_count_value > 21 && this.state.current_count_value <= 21){
            let new_amount = this.state.bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You won!",
                game_over: true,
                continue: true,
                bet_amount: 0,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer tie
        }else if((this.state.dealer_count_value === 21 && this.state.current_count_value === 21) || (this.state.dealer_count_value === this.state.current_count_value)){
            this.state.wallet_amount += this.state.bet_amount;
            this.setState({
                message : "Its a tie!",
                continue: true,
                game_over: true,
                bet_amount: 0,
                wallet_amount: this.state.wallet_amount
            })
        //Dealer has greater value Player loses
        }else if(this.state.dealer_count_value <= 21 && this.state.dealer_count_value > this.state.current_count_value){
            this.setState({
                message: "You've lost!",
                continue: true,
                game_over: true,
                bet_amount: 0,
            })
        //Dealer has lower value Player wins
        }else if(this.state.dealer_count_value <= 21 && this.state.dealer_count_value < this.state.current_count_value){
            let new_amount = this.state.bet_amount;
            new_amount = new_amount * 2;
            this.state.wallet_amount += new_amount;
            this.setState({
                message: "You've won!",
                continue: true,
                game_over: true,
                bet_amount: 0,
                wallet_amount: this.state.wallet_amount,
            })
        }
    }
   
    

  }

  bet_amount_value(amount){
    let aftermath_amount = this.state.wallet_amount - amount;
    //over 0
    if(aftermath_amount >= 0){
        if(this.state.card_left_side && !this.state.card_right_side){
            this.setState({
                left_bet_amount: this.state.left_bet_amount + amount,
                wallet_amount: this.state.wallet_amount - amount,
            })
        }else if(!this.state.card_left_side && this.state.card_right_side){
            this.setState({
                right_bet_amount: this.state.right_bet_amount + amount,
                wallet_amount: this.state.wallet_amount - amount,
            })
        }else if(!this.state.card_left_side && !this.state.card_left_side){
            this.setState({
                bet_amount: this.state.bet_amount + amount,
                wallet_amount: this.state.wallet_amount - amount
            })
        }
    //under 0
    }else{
        if(this.state.card_left_side && !this.state.card_right_side){
            this.setState({
                left_bet_amount: this.state.left_bet_amount,
                wallet_amount: this.state.wallet_amount
            })
        }else if(!this.state.card_left_side && this.state.card_right_side){
            this.setState({
                right_bet_amount: this.state.right_bet_amount,
                wallet_amount: this.state.wallet_amount
            })
        }else if(!this.state.card_left_side && !this.state.card_right_side){
            this.setState({
                bet_amount: this.state.bet_amount,
                wallet_amount: this.state.wallet_amount
            })
        }
    }
  }
  loan_me_amount(amount){
    this.setState({
        wallet_amount: this.state.wallet_amount + amount
    })
  }
  retry_me(){
    this.state.game_over = true;
    this.state.continue = false;
    this.state.current_count_value = 0;
    this.state.dealer_count_value = 0;
    this.state.left_count_value = 0;
    this.state.right_count_value = 0;
    this.state.left_side_hand = [];
    this.state.right_side_hand = [];
    this.state.player_hand = [];
    this.state.dealer_hand = [];
    this.state.card_split_boolean = false;
    this.setState({
        game_over: true,
        continue: false,
        current_count_value: 0,
        dealer_count_value: 0,
        left_count_value: 0,
        right_count_value: 0,
        left_side_hand: [],
        right_side_hand: [],
        card_split_boolean: false,
        player_hand: [],
        dealer_hand: [],
        message: ""
    })
    const dealer_card_1 = this.state.deck.shift();
    this.state.dealer_hand.push(dealer_card_1);
    this.calculate_dealer_card_value(dealer_card_1);

    const player_card_1 = this.state.deck.shift()
    this.state.player_hand.push(player_card_1);

    const player_card_2 = this.state.deck.shift();
    this.state.player_hand.push(player_card_2);

    this.add_x_val_cards_probability(dealer_card_1);
    this.add_x_val_cards_probability(player_card_1);
    this.add_x_val_cards_probability(player_card_2);
    this.initialize_player_cards_value(player_card_1, player_card_2);
    this.state.total_num_cards_dealt += 3;
    this.setState({
        player_hand: this.state.player_hand,
        dealer_hand: this.state.dealer_hand,
        current_count_value: this.state.current_count_value,
        dealer_count_value: this.state.dealer_count_value,
        game_over: false,
        total_num_cards_dealt: this.state.total_num_cards_dealt
    })
  }
  probability_number(number2){
    
    var total_times_seen = 0;

    if(this.state.x_val_cards.has(number2)){
        total_times_seen = this.state.x_val_cards.get(number2)
    }

    //this.state.x_val_cards.set(number2,total_times_seen);
    console.log("X_val_cards: ")
    console.log([...this.state.x_val_cards.entries()])
    if(this.state.total_num_cards_dealt >= 52 && this.state.total_num_cards_dealt < 104){
        this.state.current_num_decks = 2
    }else if(this.state.total_num_cards_dealt >= 104 && this.state.total_num_cards_dealt < 156){
        this.state.current_num_decks = 3;
    }else if(this.state.total_num_cards_dealt >= 156 && this.state.total_num_cards_dealt < 208){
        this.state.current_num_decks = 4;
    }
    console.log("Num of cards dealt: " + this.state.total_num_cards_dealt);
    console.log("Num of decks being used: " + this.state.current_num_decks);

    let percent = (4*this.state.current_num_decks - total_times_seen)/(52*this.state.current_num_decks - this.state.total_num_cards_dealt);
    if(percent < 0){
        percent = 0
    }
    return (percent*100).toFixed(2);
   

  }
  
  render() {
    return (
      <div id="background">
        <strong className="labels">Dealers hand</strong>
        <table className="cards">
            <tr>
                {this.state.dealer_hand.map((card, i) => {return <Card key={i} number={card.number} suit={card.suit} color={this.state.card_split_style[0]}/>}) }

            </tr>
        </table>
        <strong className="labels">Players Hand</strong>
        <table className="cards">
            <tr>
                {!this.state.card_split_boolean && this.state.player_hand.map((card, i) => {return <Card key={i} number={card.number} suit={card.suit} color={this.state.card_style} />})}
                {this.state.card_split_boolean && this.state.left_side_hand.map((card,i) => {return <Card key={i} number={card.number} suit={card.suit} color={this.state.card_split_style[1]} />})}
                {this.state.card_split_boolean && this.state.right_side_hand.map((card,i) => {return <Card key={i} number={card.number} suit={card.suit} color={this.state.card_split_style[2]} />})}
            </tr>
        </table>
        <p>{this.state.message}</p>
        <p>Dealer Count Value: {this.state.dealer_count_value}</p>
        {!this.state.card_split_boolean && <p>Player Count Value: {this.state.current_count_value}</p>}
        {this.state.card_split_boolean && <p className="left-count-value">Left Count Value: {this.state.left_count_value}</p>}
        {this.state.card_split_boolean && <p className="right-count-value">Right Count Value: {this.state.right_count_value}</p>}

        <br/>
        <div>
            <strong className="card-count-prediction">Card Counting Prediction:</strong>
            <br></br>
            <br></br>
            <div class="card-count-number-container">
                <div>A</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div>10</div>
                <div>J</div>
                <div>K</div>
                <div>Q</div>
            </div>
            <br></br>
            <strong className="card-count-percentage_label">Card Count Percentage:</strong>
            <br></br>
            <br></br>
            <div class="card-count-percentage-container">
                <div>{this.probability_number("A")}%</div>
                <div>{this.probability_number("2")}%</div>
                <div>{this.probability_number("3")}%</div>
                <div>{this.probability_number("4")}%</div>
                <div>{this.probability_number("5")}%</div>
                <div>{this.probability_number("6")}%</div>
                <div>{this.probability_number("7")}%</div>
                <div>{this.probability_number("8")}%</div>
                <div>{this.probability_number("9")}%</div>
                <div>{this.probability_number("10")}%</div>
                <div>{this.probability_number("J")}%</div>
                <div>{this.probability_number("Q")}%</div>
                <div>{this.probability_number("K")}%</div>
            </div>
        </div>
        <button className="hit-label" onClick={() => this.hit_me()}>Hit</button>
        <div>
            <button className="stand-label" onClick={() => this.stand_me()}>Stand</button>
            <button className="double-label" onClick={() => this.double_me()}>Double</button>

        </div>
        <button className="split-label" onClick={() => this.split_me()}>Split</button>
        <br/>
        { this.state.continue && <button id="retry_button" onClick={() => this.retry_me()}>Retry?</button> }
        <p className="min-max-label">
            Min: $1
        </p>
        <p className="min-max-label">
            Max: Unlimited
        </p>
        {!this.state.card_split_boolean && <p className="bet-label">Bet Amount: ${this.state.bet_amount}</p> }
        {this.state.card_split_boolean && <p className="left-bet-label">Left Bet Amount: ${this.state.left_bet_amount}</p> }
        {this.state.card_split_boolean && <p className="right-bet-label">Right Bet Amount: ${this.state.right_bet_amount}</p> }

        <p className="wallet-label">
            Wallet Amount: ${this.state.wallet_amount}
        </p>
        <button onClick={() => this.bet_amount_value(1)} className="one-button">1$</button>
        <button onClick={() => this.bet_amount_value(5)} className="five-button">5$</button>
        <button onClick={() => this.bet_amount_value(10)} className="ten-button">10$</button>
        <button onClick={() => this.bet_amount_value(25)} className="twenty-five-button">25$</button>
        <button onClick={() => this.bet_amount_value(50)} className="fifty-button">50$</button>
        <button onClick={() => this.bet_amount_value(100)} className="hundred-button">100$</button>
        <div>
            <p id="loan_title">Loans</p>
            <button id="loan_me_100" onClick={() => this.loan_me_amount(100)}>$100</button>
            <button id="loan_me_1000" onClick={() => this.loan_me_amount(1000)}>$1000</button>
            <button id="loan_me_5000" onClick={() => this.loan_me_amount(5000)}>$5000</button>
            <button id="loan_me_10000" onClick={() => this.loan_me_amount(10000)}>$10000</button>
        </div>
    </div>
    )
  }
}

const Card = ({number, suit, color}) => {
    const combo = (number) ? `${number}${suit}` : null;
    return (
        <div className={color}>
            { combo }
        </div>
    )

}


export default Blackjack
