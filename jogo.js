console.log('[Ferdinand] Flappy Bird')

const som_HIT = new Audio ()
som_HIT.src = './effects/effects_hit.wav'

const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura
    const chaoY = chao.y

    if(flappyBirdY >= chaoY) {
        return true
    }

    return false
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            console.log('devo pular')
            console.log('[antes]', flappyBird.velocidade)
            flappyBird.velocidade = - flappyBird.pulo
            console.log('[depois]', flappyBird.velocidade)
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if(fazColisao(flappyBird, chao)) {
            console.log('Fez colisao')
            som_HIT.play()

            setTimeout(() => {
                mudaParaTela(Telas.INICIO)
            }, 500)
            
            return
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
            flappyBird.y = flappyBird.y + flappyBird.velocidade
        },
        desenha() {
            contexto.drawImage(
                sprites, 
                flappyBird.spriteX, flappyBird.spriteY, // sprite x, sprite y
                flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
                flappyBird.x, flappyBird.y, // localização no papel
                flappyBird.largura, flappyBird.altura, // tamanho no papel
            )
        }
    }
    return flappyBird
}

/*
Chão
*/

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1
            const repeteEm = chao.largura / 2
            const movimentacao = chao.x - movimentoDoChao
            
            // console.log('[chao.x]', chao.x)
            // console.log('[repeteEm]', repeteEm)
            // console.log('[moveimentacao]', movimentacao % repeteEm)
        
            chao.x = movimentacao % repeteEm
        },
        desenha() {
            contexto.drawImage(
            sprites, 
            chao.spriteX, chao.spriteY, // sprite x, sprite y
            chao.largura, chao.altura, // tamanho do recorte na sprite
            chao.x, chao.y, // localização no papel
            chao.largura, chao.altura, // tamanho no papel
            )

        contexto.drawImage(
            sprites, 
            chao.spriteX, chao.spriteY, // sprite x, sprite y
            chao.largura, chao.altura, // tamanho do recorte na sprite
            (chao.x + chao.largura), chao.y, // localização no papel
            chao.largura, chao.altura, // tamanho no papel
            )    
        },    
    }
    return chao
}



const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0,0, canvas.width, canvas.height)
        
        contexto.drawImage(
            sprites, 
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x, sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y, // localização no papel
            planoDeFundo.largura, planoDeFundo.altura, // tamanho no papel
        )

        contexto.drawImage(
            sprites, 
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x, sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, // localização no papel
            planoDeFundo.largura, planoDeFundo.altura, // tamanho no papel
        )
    }
}

const telaInicio = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites, 
            telaInicio.sX, telaInicio.sY, // sprite x, sprite y
            telaInicio.w, telaInicio.h, // tamanho do recorte na sprite
            telaInicio.x, telaInicio.y, // localização no papel
            telaInicio.w, telaInicio.h, // tamanho no papel
        )    
    }    
}

/*
Telas
*/

const globais = {}
let telaAtiva = {}
function mudaParaTela(novaTela) {
    telaAtiva = novaTela

    if(telaAtiva.inicializa){ 
        telaAtiva.inicializa()   
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao()
        },
        desenha() {
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.flappyBird.desenha()
            telaInicio.desenha()
        },
        click() {
            mudaParaTela(Telas.JOGO)
        },
        atualiza() {
            globais.chao.atualiza()    
        }
    }
}

Telas.JOGO = {
    desenha () {
        planoDeFundo.desenha()
        globais.chao.desenha()
        globais.flappyBird.desenha()
    },
    click() {
        globais.flappyBird.pula() 
    },
    atualiza() {
        globais.flappyBird.atualiza()
    }
}

function loop() {
    
    telaAtiva.desenha()
    telaAtiva.atualiza()

    requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaParaTela(Telas.INICIO)
loop()