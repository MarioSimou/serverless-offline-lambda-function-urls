const wait = sec => new Promise(resolve => setTimeout(resolve, sec * 1000))

export const ping = async event => {
  await wait(45)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  }
}
