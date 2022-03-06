// Copyright (c) 2022 Ivan Teplov

import { random } from "./random"

export const randomPastelColor = () => `hsl(${random(0, 360)}, 70%, 80%)`
