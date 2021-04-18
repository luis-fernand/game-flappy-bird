console.log('[Ferdinand] Flappy Bird')

const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura
    const chaoY = chao.y

    if(flappyBirdY >= chaoY){
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
            flappyBird.velocidade = - flappyBird.pulo
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza () {
            if (fazColisao(flappyBird, chao)){
            console.log('Fez colisao')

            mudaParaTela(Telas.INICIO)
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



const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
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
    }    
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
        inicializa()   
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird()
        },
        desenha() {
            planoDeFundo.desenha()
            chao.desenha()
            globais.flappyBird.desenha()
            telaInicio.desenha()
        },
        click() {
            mudaParaTela(Telas.JOGO)
        },
        atualiza() {
            
        }
    }
}

Telas.JOGO = {
    desenha () {
        planoDeFundo.desenha()
        chao.desenha()
        globais.flappyBird.desenha()
    },
    click() {
        globais.flappyBird.pula() 
    },
    atualiza(){
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