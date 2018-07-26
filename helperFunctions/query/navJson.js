const toNavJSON = (page) => {
  const idArray = []
  const mockPage = []
  
  for (let i = 0; i < page.length; i++) {
    const element = page[i];
     for (const key in element) {
         if(key === 'navigation_id' && !idArray.includes(element[key])){
           idArray.push(element[key])
           if(element.children.page === null){
            mockPage.push({
              page: element.page,
              link: element.link,
              order: element.order,
              children: null
            })
            break
           }else{
            mockPage.push({
              page: element.page,
              link: element.link,
              order: element.order,
              children: [(element.children)]
            })
            break
           }
         }
        else if (key === 'navigation_id' && idArray.includes(element[key])){
             const queryIndex = idArray.indexOf(element.navigation_id)
             mockPage[queryIndex].children.push(element.children)
           break
          }
     }
  }
  return mockPage
}


module.exports ={toNavJSON}