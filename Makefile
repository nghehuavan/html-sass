deploy:
	sass sass/styles.scss css/styles.css --style=compressed

release:
	git checkout release
	git pull origin main
	sass sass/styles.scss css/styles.css --style=compressed
	git add css/
	git commit -m 'release'
	git push origin release
