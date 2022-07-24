function arrayCountValues({ ratings, min, max }) {
  const length = min === 0 ? max + 1 : max
  const defaultValues = Array.from(Array(length), (_, i) => i).reduce(
    (r, x) => {
      r[x + min] = 0
      return r
    },
    {}
  )

  return ratings.reduce((result, number) => {
    result[number] ? result[number] = result[number] + 1 : result[number] = 1
    return result
  }, defaultValues)
}

function calculateRatingScore({ ratings, min, max }) {
  const values = arrayCountValues({ ratings, min, max })

  const { positive, negative, total } = Object.values(values).reduce(
    (result, value, index) => {
      const input = { min, max }

      const nextPositive = value * mapValue({ value: index + 1, input, output: { min: 0, max: 1 } })
      const nextNegative = value * mapValue({ value: index + 1, input, output: { min: 1, max: 0 } })

      result.positive = result.positive + nextPositive
      result.negative = result.negative + nextNegative
      result.total = result.positive + result.negative

      return result
    },
    { positive: 0, negative: 0, total: 0 }
  )

  const result = ((total) > 0)
    ? ((positive + 1.9208) / (total) - 1.96 * Math.sqrt(((positive * negative) / (total)) + 0.9604) / (total)) / (1 + 3.8416 / (total))
    : 0

  return result
}

function mapValue({ value, input, output }) {
  return (value - input.min) * (output.max - output.min) / (input.max - input.min) + output.min;
}

module.exports = {
  calculateRatingScore
}
