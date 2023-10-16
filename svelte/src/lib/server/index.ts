// place files you want to import through the `$lib` alias in this folder.
import {auth} from "./lucia"
import prisma from "../prisma"

export {
  auth,
  prisma
}