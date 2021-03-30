import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = () => {
  return {
    container: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    mainTitle: {
      textAlign: 'left',
      position: 'static',
      width: '80%',
      maxWidth: '600px',
      left: '0px',
      top: '60px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '28px',
      lineHeight: '24px',
      color: '#9226AD',
      flex: 'none',
      order: 0,
      flexGrow: 1,
      padding: '80px 0px 10px 0px ',
    },
    paragraph: {
      textAlign: 'left',
      position: 'static',
      width: '80%',
      maxWidth: '600px',
      minWidth: '280px',
      left: '0px',
      top: '0px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '28px',
      color: '#42424F',
      flex: 'auto',
      order: 0,
      flexGrow: 1,
      margin: '20px 0px 80px 0px',
    },
    image: {
      width: '80%',
      maxWidth: '300px',
      margin: '0.5em 0',
    },
    loginBtn: {
      fontWeight: '700',
      width: '88%',
      maxWidth: '600px',
      padding: '20px 20px',
      margin: '20px 20px 40px 20px',
    },
    footer: {
      marginTop: '1.5em',
      width: '100%',
      height: '278px',
      backgroundColor: '#9226AD',
    },
    footerChild: {
      margin: '2em 2em',
      padding: '40px 0px',
      textAlign: 'left',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
      color: '#FFFFFF',
    },
  }
}

class OnBoarding extends React.Component {
  loginClickHandler = () => {
    this.props.history.push('/login')
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <h1 className={classes.mainTitle}>Say Hello to Rooms</h1>
        <div className={classes.paragraph}>No more pen &amp; paper or excel sheets or whatever you use to manage your Hotel</div>
        <img alt="" className={classes.image} src="./intro/01.png" />
        <div className={classes.paragraph}>Track your bookings hassle-free, manage rooms availability, create special offers, and get connected to online travel agencies</div>
        <Button className={classes.loginBtn} variant="contained" color="secondary" onClick={this.loginClickHandler}>LOG IN TO ROOMS</Button>
        <div className={classes.paragraph}>Rooms is a lightweight one-stop hotel management web application, that gives you all you need, and nothing you don’t really need</div>
        <h1 className={classes.mainTitle}>All you need</h1>
        <img alt="" className={classes.image} src="./intro/02.png" />
        <div className={classes.paragraph}>Create a Profile for your Hotel and let travellers find you immediately</div>
        <img alt="" className={classes.image} src="./intro/03.png" />
        <div className={classes.paragraph}>Add your Rooms, so that the travellers could see what they can book</div>
        <img alt="" className={classes.image} src="./intro/04.png" />
        <div className={classes.paragraph}>Create special offers, discounts, and price increases to manage high and low seasons. Travellers instantly get the updated rates</div>
        <img alt="" className={classes.image} src="./intro/05.png" />
        <div className={classes.paragraph}>Enjoy the power of API and recieve automatic bookings from online travel agencies</div>
        <img alt="" className={classes.image} src="./intro/06.png" />
        <div className={classes.paragraph}>Create records manually,
so that phone reservations, walk-ins, or messenger bookings will all drop in the same bucket with those coming from the Internet</div>
        <Button className={classes.loginBtn} variant="contained" color="secondary" onClick={this.loginClickHandler}>LOG IN TO ROOMS</Button>
        <div className={classes.paragraph}>Ah, btw.. It’s free if you run a single hotel within one account</div>
        <div className={classes.footer}>
          <div className={classes.footerChild}>Provided to you by Winding Tree — Decentralized Travel Marketplace</div>
          <div className={classes.footerChild}>
            <svg width="107" height="38" viewBox="0 0 107 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="19" cy="19" r="17" stroke="white" strokeWidth="2.49333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.2651 2.68465L13.2953 8.61753M13.2953 8.61753L15.6913 9.188M13.2953 8.61753L6.79196 7.19136L9.35908 12.0404M15.6913 9.188L13.2953 15.1209M15.6913 9.188L19.2282 15.9766M15.6913 9.188L17.8833 6.90613M22.8154 13.5806L29.1544 16.3759M22.8154 13.5806L19.2282 15.9766M22.8154 13.5806L21.8169 16.9464M22.8154 13.5806L27.4482 11.8692M22.8154 13.5806L22.859 10.386M19 25.5605L23.6779 27.3289L27.6141 25.3323M19 25.5605L14.4363 27.2719M19 25.5605L16.2618 18.3155M19 25.5605L25.2181 21.9095M19 25.5605L21.8169 16.9464M19 25.5605V36.0001M27.6141 25.3323L33.7752 27.386M27.6141 25.3323L32.349 20.5404M27.6141 25.3323L25.2181 21.9095M32.349 20.5404L35.3155 23.735M32.349 20.5404L35.2584 14.094M32.349 20.5404L29.1544 16.3759M29.1544 16.3759L34.2886 11.584M29.1544 16.3759L25.2181 21.9095M33.2618 9.75847L27.4482 11.8692M16.2618 18.3155L13.2953 15.1209M16.2618 18.3155L19.2282 15.9766M16.2618 18.3155L13.5235 21.9665M13.2953 15.1209L9.35908 12.0404M13.2953 15.1209L8.047 20.2551M9.35908 12.0404L4.85237 16.7753M4.85237 16.7753L2.62753 14.4363M4.85237 16.7753L8.047 20.2551M8.047 20.2551L2.68458 23.6779M8.047 20.2551L9.92955 25.5605M8.047 20.2551L13.5235 21.9665M9.92955 25.5605L4.2819 27.6142M9.92955 25.5605L14.4363 27.2719M14.4363 27.2719L13.5235 21.9665M25.2181 21.9095L21.8169 16.9464M22.8154 8.61753L22.651 2.39941L17.8833 6.90613M22.8154 8.61753L27.2718 7.76183M22.8154 8.61753L22.859 10.386M30.9228 6.90613L27.2718 7.76183M27.2718 7.76183L27.4482 11.8692M22.859 10.386L17.8833 6.90613" stroke="white" strokeWidth="1.24667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M104.28 13.2203H106.545V16.979C105.996 17.3207 105.447 17.6624 104.76 17.8674C104.074 18.0724 103.388 18.1408 102.701 18.1408C101.74 18.1408 100.848 17.9358 100.093 17.5257C99.3382 17.1157 98.7206 16.569 98.3087 15.8172C97.8969 15.0655 97.6226 14.2454 97.6226 13.357C97.6226 12.4686 97.8284 11.6485 98.3087 10.8968C98.7206 10.1451 99.3382 9.59833 100.162 9.1883C100.917 8.77826 101.809 8.57324 102.77 8.57324C103.594 8.57324 104.417 8.70993 105.103 8.98328C105.79 9.25663 106.339 9.66666 106.819 10.2134L105.172 11.7169C104.554 11.0335 103.8 10.6918 102.976 10.6918C102.221 10.6918 101.535 10.8968 101.054 11.3752C100.574 11.8535 100.368 12.4686 100.368 13.2887C100.368 13.767 100.505 14.2454 100.711 14.6555C100.917 15.0655 101.26 15.3388 101.603 15.6122C102.015 15.8172 102.427 15.9539 102.976 15.9539C103.456 15.9539 103.937 15.8856 104.349 15.6806V13.2203H104.28Z" fill="white" />
              <path d="M95.9752 8.84657V17.9357H93.7791L89.7295 13.0836V17.9357H87.1902V8.84657H89.3863L93.4359 13.6987V8.84657H95.9752Z" fill="white" />
              <path d="M85.131 8.84657H82.5229V18.0041H85.131V8.84657Z" fill="white" />
              <path d="M71.4043 8.84657H75.7283C76.7578 8.84657 77.6501 9.05161 78.405 9.39329C79.1601 9.73499 79.7777 10.2817 80.1896 10.9651C80.6013 11.6485 80.8072 12.4686 80.8072 13.357C80.8072 14.2454 80.6013 15.0655 80.1896 15.7489C79.7777 16.4323 79.1601 16.979 78.405 17.3207C77.6501 17.6624 76.7578 17.8674 75.7283 17.8674H71.4043V8.84657ZM75.6667 15.8172C76.4216 15.8172 77.101 15.6805 77.5815 15.2022C78.062 14.7921 78.2679 14.1771 78.2679 13.357C78.2679 12.6053 78.062 11.9902 77.5815 11.5118C77.101 11.1018 76.4832 10.8284 75.6598 10.8284H74.0124V15.8172H75.6667Z" fill="white" />
              <path d="M69.3455 8.84657V17.9357H67.2179L63.1683 13.0836V17.9357H60.6289V8.84657H62.7565L66.8059 13.6987V8.84657H69.3455Z" fill="white" />
              <path d="M58.5698 8.84657H55.9617V18.0041H58.5698V8.84657Z" fill="white" />
              <path d="M54.726 8.84657L51.7747 17.9357H48.9608L47.2449 12.4002L45.3919 17.9357H42.5777L39.6267 8.84657H42.3033L44.1565 14.6554L46.0783 8.84657H48.4803L50.3335 14.7238L52.2552 8.84657H54.726Z" fill="white" />
              <path d="M77.2944 27.4849V29.5351H69.882V20.3775H77.0885V22.3594H72.4899V23.9313H76.5395V25.8446H72.4899V27.4849H77.2944Z" fill="white" />
              <path d="M68.0285 27.4849V29.5351H60.6847V20.3775H67.8227V22.3594H63.2243V23.9313H67.2736V25.8446H63.2243V27.4849H68.0285Z" fill="white" />
              <path d="M54.7137 27.0749H53.2725V29.4666H50.6643V20.3775H54.851C55.6747 20.3775 56.4296 20.5142 56.9786 20.7876C57.5964 21.0609 58.0769 21.471 58.4201 21.9493C58.7633 22.4277 58.9004 23.0428 58.9004 23.7261C58.9004 24.4094 58.7633 24.9564 58.4201 25.4348C58.214 25.9815 57.8023 26.323 57.1847 26.6648L59.175 29.5351H56.4296L54.7137 27.0749ZM56.361 23.7261C56.361 23.3161 56.2237 22.9745 55.9491 22.7694C55.6747 22.5644 55.263 22.4277 54.7137 22.4277H53.2725V25.093H54.7825C55.3315 25.093 55.7432 24.9564 56.0179 24.7512C56.2237 24.478 56.361 24.2045 56.361 23.7261Z" fill="white" />
              <path d="M44.144 22.4277H41.33V20.3775H49.4975V22.4277H46.6835V29.5351H44.144V22.4277Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(OnBoarding))
