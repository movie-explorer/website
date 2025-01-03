import axios from 'axios'

const parseXML = xml => {
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

export const fetchShowtimes = async (date, area) => {
  const response = await axios.get(`https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${date}`)
  return parseXML(response.data)
}

const API_URL = 'https://moviexplorer.site';

const headers = (token) => ({
    'Content-Type': 'application/json',
    Authorization: token,
});

export const fetchGroups = async (token) => {
    const response = await fetch(`${API_URL}/groups/info`, {
        method: 'GET',
        headers: headers(token),
    });
    return response.json();
};

export const createGroup = async (groupName, token) => {
    const response = await fetch(`${API_URL}/groups/update`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ groupName }),
    });
    return response.json();
};

export const deleteGroup = async (groupid, token) => {
    const response = await fetch(`${API_URL}/groups/delete`, {
        method: 'DELETE',
        headers: headers(token),
        body: JSON.stringify({ groupid }),
    });
    return response.json();
};

export const addMovieToGroup = async (groupid, movieName, tmdbID, token) => {
    const response = await fetch(`${API_URL}/groups/update`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ groupid, movieName, tmdbID }),
    });
    return response.json();
};

export const fetchGroupDetails = async (groupid, token) => {
    const response = await fetch(`${API_URL}/groups/info?groupid=${groupid}`, {
        method: 'GET',
        headers: headers(token),
    });
    return response.json();
};
