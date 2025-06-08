
import messages from '../../locales'


// interface InitLocalisation {
//   messages: Record<string, string> | undefined
//   locale: string
// }

const initLocalisation = () => {
  // User's language
  const language = localStorage.getItem('locale')?localStorage.getItem('locale'):'en';
  return {
    messages: messages[language],
    locale: language
  }
}

export default initLocalisation