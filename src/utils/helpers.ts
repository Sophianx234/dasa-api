import { adjectives, animals, uniqueNamesGenerator} from "unique-names-generator"

export function genRandomName (){
    const customConfig = {
      dictionaries: [animals,adjectives],
      separator: '',
      length: 2,
      style: `capital` as 'capital'

    }
    return  uniqueNamesGenerator(customConfig).replace("_",'') + Math.floor(Math.random()*100)

  }