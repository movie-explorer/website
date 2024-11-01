import axios from 'axios'

const parseXML = (xml) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, 'text/xml')
  const shows = xmlDoc.getElementsByTagName('Show')
  const movies = []

  for (let show of shows) {
    const title = show.getElementsByTagName('Title')[0].textContent
    const showtime = show.getElementsByTagName('dttmShowStart')[0].textContent
    const language = show.getElementsByTagName('SpokenLanguage')[0].getElementsByTagName('Name')[0].textContent
    const subtitles = show.getElementsByTagName('SubtitleLanguage1')[0]?.getElementsByTagName('Name')[0]?.textContent
    const rating = show.getElementsByTagName('Rating')[0].textContent
    const genres = show.getElementsByTagName('Genres')[0].textContent.split(', ')
    const auditorium = show.getElementsByTagName('TheatreAndAuditorium')[0].textContent
    const link = show.getElementsByTagName('ShowURL')[0].textContent
    const poster = show.getElementsByTagName('EventLargeImagePortrait')[0].textContent

    movies.push({
      title,
      showtime,
      language,
      subtitles,
      rating,
      genres,
      auditorium,
      link,
      poster
    })
  }

  return movies
}

export const fetchShowtimes = async () => {
  const response = await axios.get('https://www.finnkino.fi/xml/Schedule/?area=1018&dt=01.11.2024')
  return parseXML(response.data)
}
