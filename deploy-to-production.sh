#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rsync -avz --exclude '.git' --delete $DIR/public/ deploy@spaceshapeshifter.liviucmg.com:/var/www/spaceshapeshifter.liviucmg.com/
