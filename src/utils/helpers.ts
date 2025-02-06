import { uniqueNamesGenerator,adjectives,animals} from "unique-names-generator"
export function genRandomName (){
    const customConfig = {
      dictionaries: [animals],
      seperator: '',
      length: 2,
      style: 'capital' as 'capital'

    }
    return  uniqueNamesGenerator(customConfig).replace("_",'') + Math.floor(Math.random()*100)

  }