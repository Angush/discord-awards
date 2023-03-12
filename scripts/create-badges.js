import satori from 'satori'
import sharp from 'sharp'
import convertSvgToPng from 'convert-svg-to-png'
const { createConverter } = convertSvgToPng
const converter = createConverter()
import fs from 'fs'

const currentYear = process.env.YEAR
  ? parseInt(process.env.year)
  : new Date().getFullYear() - 1

const colourMap = {
  '1st': {
    primary: `#FFD15C`,
    secondary: `#F8B64C`,
    tertiary: `#FFECCE`,
  },
  '2nd': {
    primary: `#FEFEFE`,
    secondary: `#E0E0E0`, //`#ECECEC`,
    tertiary: `#B5B5B5`, //`#BFBFBF`,
  },
  '3rd': {
    primary: `#F58E42`,
    secondary: `#D47937`,
    tertiary: `#FFD7BA`,
  },
}

const toSentenceCase = str => {
  if (typeof str !== 'string') return str
  if (str.match(/[.?!‽]['"‘’“”()\[\]{}]?$/)) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
  } else {
    return str.slice(0, 1).toUpperCase() + str.slice(1) + '.'
  }
}

const getSatoriText = async data => {
  const colours = colourMap[data.placement ?? '1st']
  // todo: use variables for all changing data, including which set of colours to use

  return await satori(
    {
      type: 'div',
      props: {
        style: {
          maxWidth: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: '#fff',
          backgroundColor: '#343434',
          borderRadius: '1.5rem',
          fontWeight: '600',
          textOverflow: 'ellipsis',
          border: `2px solid ${colours.primary}`, // might be too much? could comment out
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                paddingLeft: '1rem',
                paddingRight: '1rem',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingRight: '1rem',
                      paddingBottom: '1rem',
                      fontSize: '16px',
                    },
                    children: [
                      {
                        type: 'svg',
                        props: {
                          style: { width: '62.4px', height: '80px' },
                          xmlns: 'http://www.w3.org/2000/svg',
                          width: '39',
                          height: '50',
                          viewBox: '0 0 39 50',
                          fill: 'none',
                          children: [
                            {
                              type: 'path',
                              props: {
                                d: 'M13.125 10.9375H26.0416L37.3958 0H24.4791L13.125 10.9375Z',
                                fill: '#F1543F',
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M28.4374 16.7709H10.104V8.74997H28.4373V16.7709H28.4374ZM12.1873 14.6876H26.354V10.8334H12.1873V14.6876Z',
                                fill: colours.secondary,
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M26.0416 10.9375H13.125L1.66663 0H14.6874L26.0416 10.9375Z',
                                fill: '#FF7058',
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M19.2708 50C29.9138 50 38.5416 41.3722 38.5416 30.7292C38.5416 20.0862 29.9138 11.4584 19.2708 11.4584C8.62784 11.4584 0 20.0862 0 30.7292C0 41.3722 8.62784 50 19.2708 50Z',
                                fill: colours.primary,
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M19.27 46.23C10.7451 46.23 3.77002 39.255 3.77002 30.73C3.77002 22.205 10.7451 15.23 19.27 15.23C27.795 15.23 34.77 22.205 34.77 30.73C34.77 39.255 27.795 46.23 19.27 46.23Z',
                                fill: colours.secondary,
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M17.1599 18.7629C17.1389 18.7418 17.1103 18.73 17.0805 18.73C17.0508 18.73 17.0222 18.7418 17.0012 18.7629L15.6883 20.0758C15.6445 20.1197 15.6445 20.1907 15.6883 20.2346L17.4668 22.0132C12.8438 22.6019 9.27002 26.5504 9.27002 31.3337C9.27002 36.5231 13.4765 40.73 18.6654 40.73C23.4491 40.73 27.3977 37.1546 27.9853 32.53L29.7668 34.3134C29.7879 34.3345 29.8164 34.3463 29.8463 34.3463C29.876 34.3463 29.9045 34.3345 29.9256 34.3134L31.2371 33.0018C31.281 32.9579 31.281 32.8869 31.2371 32.8431L25.6894 27.2948C25.6854 27.2908 25.6812 27.2872 25.6768 27.284L25.5524 27.1595C25.5203 27.1274 25.472 27.1178 25.43 27.1352C25.3881 27.1525 25.3608 27.1935 25.3608 27.2389V31.0861C25.3608 34.7411 22.3627 37.7822 18.6654 37.7822C14.9676 37.7822 11.97 34.7843 11.97 31.0861C11.97 27.388 14.9692 24.3901 18.6654 24.3901H22.5123C22.5577 24.3901 22.5986 24.3627 22.616 24.3208C22.6333 24.2788 22.6238 24.2306 22.5917 24.1985L22.4862 24.093C22.482 24.0866 22.4772 24.0806 22.4717 24.0751L17.1599 18.7629Z',
                                fill: colours.tertiary,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column' },
                    children: [
                      {
                        type: 'h2',
                        props: {
                          style: {
                            fontSize: '22px',
                            marginTop: '1rem',
                            marginBottom: '6px',
                            width: data.name.length > 26 ? '90%' : '100%',
                            // textWrap: 'balance',
                          },
                          children: data.name,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#A0A0A0',
                            // textTransform: 'uppercase',
                            width: data.subtitle ? '90%' : '100%',
                            textWrap: data.subtitle ? 'wrap' : 'balance',
                            // display: 'flex',
                            // flexDirection: 'column',
                          },
                          children: data.subtitle
                            ? `${data.subtitle} by ${data.creator}`
                            : data.creator,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          data.description
            ? {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '15px',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    marginTop: '0.5rem',
                    marginBottom: '0.25rem',
                  },
                  children: data.description.includes('\n')
                    ? data.description.split('\n').map((descPart, index) => {
                        if (descPart && descPart.trim())
                          return {
                            type: 'span',
                            props:
                              index === 0
                                ? {
                                    children: toSentenceCase(descPart.trim()),
                                  }
                                : {
                                    children: toSentenceCase(descPart.trim()),
                                    style: {
                                      marginTop: '0.5rem',
                                    },
                                  },
                          }
                      })
                    : toSentenceCase(data.description),
                },
              }
            : undefined,
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#2a2a2a',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderRadius: '0 0 1.5rem 1.5rem',
                marginTop: '0.5rem',
                fontSize: '15px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: colours.primary,
                      display: 'flex',
                      gap: '8px',
                      marginTop: '.75rem',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            textTransform: 'uppercase',
                            color: colours.primary,
                            textAlign: 'center',
                          },
                          children: data.joint
                            ? `Joint ${data.placement}`
                            : data.placement,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#A0A0A0' },
                          children: `|`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: colours.secondary,
                            // textTransform: 'uppercase',
                          },
                          children: `${currentYear} Cauldron Awards`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#A0A0A0' },
                          children: `|`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: colours.secondary },
                          children: `${data.votes}% of voters`,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontWeight: '400',
                      color: colours.secondary,
                      maxWidth: '100%',
                      paddingBottom: '0.75rem',
                    },
                    children: data.category,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 450,
      height: 1000,
      fonts: [
        {
          name: 'Inter',
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: fs.readFileSync('./badges/inter-latin-ext-700-normal.woff'),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}

async function renderImage(nominee, category) {
  const dirName = `badges/${currentYear}/cat_${category.id}`
  const fileName = `${nominee.placement}_${nominee.id}`
  if (!fs.existsSync(`badges`)) {
    fs.mkdirSync(`badges`)
  }
  if (!fs.existsSync(`badges/${currentYear}`)) {
    fs.mkdirSync(`badges/${currentYear}`)
  }
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName)
  }

  const svg = await getSatoriText({
    name: nominee.name || nominee.title,
    creator: nominee.author,
    category: category.title,
    placement: nominee.placement,
    subtitle: nominee.name ? nominee.title : null,
    votes: Math.ceil((nominee.votes / category.voters) * 100),
    description: nominee.description,
    joint: nominee.joint,
  })
  const png = await converter.convert(svg)
  sharp(png)
    .trim(1)
    .toFile(`${dirName}/${fileName}.png`, (err, info) => {
      if (err)
        console.log(`Error on sharp output - ${dirName}/${fileName}.png`, err)
    })
}

fs.readFile(
  `./${currentYear}-results-constructed.json`,
  'utf-8',
  async (err, file) => {
    if (err) return console.error(err)
    const data = JSON.parse(file)
    console.log(`loaded ${currentYear}-results-constructed.json`)

    const categories = data.sections[0].categories
    for (const cat of categories) {
      const { nominees, ...rest } = cat
      console.log(`\nGenerating for cat_${cat.id} - ${cat.title}`)
      for (const nomIndexRaw in nominees) {
        const nomIndex = parseInt(nomIndexRaw)
        const nom = nominees[nomIndex]
        if (!nom.placement) break

        console.log(
          `  - Generating nominee /cat_${cat.id}/${nom.placement}_${nom.id}.png`
        )

        if (nominees[nomIndex - 1]?.placement === nom.placement) {
          nom.joint = true
        } else if (nominees[nomIndex + 1]?.placement === nom.placement) {
          nom.joint = true
        }

        await renderImage(nom, rest)
      }
    }

    await converter.destroy()
  }
)
