const getInitials = (name: string) => {
  if (!name.includes(" ")){
    return name[0]
  }

  const split = name.split(" ")

  console.log(split)
  if (split.length === 1) return split[0]
  return `${[split[0]]}${split[1]}`
}

export default getInitials;
