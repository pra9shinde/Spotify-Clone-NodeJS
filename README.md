<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="ExpressMusicX__A_Spotify_Clone_0"></a>ExpressMusicX - A Spotify Clone</h1>

<p class="has-line-data" data-line-start="19" data-line-end="20">Live demo hosted on Cyclic. [<a href="https://expressmusicx.cyclic.app/">https://expressmusicx.cyclic.app/</a>]</p>

<p class="has-line-data" data-line-start="4" data-line-end="5"><a href="#"><img src="https://travis-ci.org/joemccann/dillinger.svg?branch=master" alt="Build Status"></a></p>
<p class="has-line-data" data-line-start="6" data-line-end="7">ExpressMusic X is a Spotify clone web application. Following are the technologies used</p>
<ul>
<li class="has-line-data" data-line-start="8" data-line-end="9">Frontend : HTML5, CSS3, Javascript, Jquery &amp; AJAX</li>
<li class="has-line-data" data-line-start="9" data-line-end="10">Backend : NodeJS, Express</li>
<li class="has-line-data" data-line-start="10" data-line-end="12">Templating Engine : EJS</li>
<li class="has-line-data" data-line-start="10" data-line-end="12">Database : Mysql</li>
</ul>
<h1 class="code-line" data-line-start=12 data-line-end=13 ><a id="New_Features_12"></a>New Features!</h1>
<ul>
<li class="has-line-data" data-line-start="14" data-line-end="15">Create your own playlist</li>
<li class="has-line-data" data-line-start="15" data-line-end="16">Add, Remove songs to your playlist</li>
</ul>

<ul>
<li class="has-line-data" data-line-start="20" data-line-end="21">App is hosted on free hosting plan by Cyclic. App will be slower because free plan has minimum hardware config.</li>
<li class="has-line-data" data-line-start="21" data-line-end="22">You can register on ExpressMusicX as a new user.</li>
<li class="has-line-data" data-line-start="22" data-line-end="24">or you can signin as guest user. Following are login credentials.</li>
</ul>
<p class="has-line-data" data-line-start="24" data-line-end="26">Username: guest<br>
Password: 12345678</p>
<p class="has-line-data" data-line-start="27" data-line-end="28">This text you see here is <em>actually</em> written in Markdown! To get a feel for Markdown’s syntax, type some text into the left window and watch the results in the right.</p>
<h3 class="code-line" data-line-start=29 data-line-end=30 ><a id="Installation_29"></a>Installation</h3>
<p class="has-line-data" data-line-start="31" data-line-end="32">ExpressMusicX requires <a href="https://nodejs.org/">Node.js</a> v4+ and <a href="https://www.mysql.com/">Mysql</a> to run the app locally or on server.</p>
<p class="has-line-data" data-line-start="33" data-line-end="35">For production as well local, you need to create environment variables with your credentials…<br>
You can check on google how to add environment variables to your operating system :)</p>
<pre><code class="has-line-data" data-line-start="36" data-line-end="42" class="language-sh">BASE_URL=http://localhost:<span class="hljs-number">3000</span>/
DB_HOST=localhost //Your database hostname
DB_USER=root //Your database user name
DB_PASSWORD=password //Your database password
DB_NAME=slotify //Your Database Name
</code></pre>
<p class="has-line-data" data-line-start="43" data-line-end="44">Import the Mysql database into your database engine, slotify.sql is included in the repository</p>
<p class="has-line-data" data-line-start="45" data-line-end="46">Install the dependencies and devDependencies and start the server.</p>
<pre><code class="has-line-data" data-line-start="47" data-line-end="51" class="language-sh">$ <span class="hljs-built_in">cd</span> expressmusicx
$ npm install
$ npm start
</code></pre>
<p class="has-line-data" data-line-start="52" data-line-end="53">You can also start with nodemon.</p>
<pre><code class="has-line-data" data-line-start="54" data-line-end="58" class="language-sh">$ <span class="hljs-built_in">cd</span> expressmusicx
$ npm install
$ npm run dev
</code></pre>
<p class="has-line-data" data-line-start="59" data-line-end="60">Currently Songs, Artists, Genres &amp; Albums are created from backend but in future updates It will be added.</p>
<h3 class="code-line" data-line-start=60 data-line-end=61 ><a id="Todos_60"></a>Todos</h3>
<ul>
<li class="has-line-data" data-line-start="62" data-line-end="63">Artist : Artist Register, Create Album, Upload Songs</li>
<li class="has-line-data" data-line-start="63" data-line-end="65">Song Recommendation Algorithm</li>
</ul>
<h2 class="code-line" data-line-start=65 data-line-end=67 ><a id="License_65"></a>License</h2>
<p class="has-line-data" data-line-start="68" data-line-end="69">MIT</p>
<p class="has-line-data" data-line-start="71" data-line-end="72"><strong>Free Software, Hell Yeah!</strong></p>
